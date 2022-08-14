import slugify from '@sindresorhus/slugify'
import arg from 'arg'
import commandExists from 'command-exists'
import { createProject } from './lib/createProject'
import { getDatabaseConnection } from './lib/getDatabaseConnection'
import { getPayloadSecret } from './lib/getPayloadSecret'
import { parseLanguage } from './lib/parseLanguage'
import { parseProjectName } from './lib/parseProjectName'
import { parseCollections } from './lib/parseCollections'
import { writeEnvFile } from './lib/writeEnvFile'
import type { CliArgs } from './types'
import { success } from './utils/log'
import { helpMessage, successMessage, welcomeMessage } from './utils/messages'
import { setTags } from './utils/usage'
import { getValidCollections, validateCollections } from './lib/collections'

export class Main {
  args: CliArgs

  constructor() {
    this.args = arg(
      {
        '--help': Boolean,
        '--name': String,
        '--language': String,
        '--collections': String,
        '--db': String,
        '--secret': String,
        '--use-npm': Boolean,
        '--no-deps': Boolean,
        '--dry-run': Boolean,
        '--beta': Boolean,

        '-h': '--help',
        '-n': '--name',
        '-t': '--template',
      },
      { permissive: true },
    )
  }

  async init(): Promise<void> {
    try {
      if (this.args['--help']) {
        console.log(await helpMessage())
        process.exit(0)
      }
      const collectionsArg = this.args['--collections']
      if (collectionsArg) {
        const valid = await validateCollections(collectionsArg)
        if (!valid) {
          console.log(await helpMessage())
          process.exit(1)
        }
      }

      console.log(welcomeMessage)
      const projectName = await parseProjectName(this.args)
      const language = await parseLanguage(this.args)
      const validCollections = await getValidCollections()
      const collections = await parseCollections(this.args, validCollections)
      const databaseUri = await getDatabaseConnection(this.args, projectName)
      const payloadSecret = await getPayloadSecret(this.args)
      const projectDir = `./${slugify(projectName)}`
      const packageManager = await getPackageManager(this.args)

      if (!this.args['--dry-run']) {
        await createProject(this.args, projectDir, collections, language, packageManager)
        await writeEnvFile(projectName, databaseUri, payloadSecret)
      }

      success('Payload project successfully created')
      console.log(await successMessage(projectDir, packageManager))
    } catch (error) {
      console.log(error)
    }
  }
}

async function getPackageManager(args: CliArgs): Promise<string> {
  let packageManager: string
  if (args['--use-npm']) {
    packageManager = 'npm'
  } else {
    try {
      await commandExists('yarn')
      packageManager = 'yarn'
    } catch (error) {
      packageManager = 'npm'
    }
  }
  setTags({ package_manager: packageManager })
  return packageManager
}
