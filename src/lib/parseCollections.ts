import prompts from 'prompts'
import type { CliArgs } from '../types'
import { setTags } from '../utils/usage'

export async function parseCollections(
  args: CliArgs,
  validCollections: string[],
): Promise<string[]> {
  if (args['--collections']) {
    const collections = args['--collections']
    const collectionNames = collections.split(',').map((collection) => collection.replaceAll(' ', ''))
    const collection = validCollections.find(collection => validCollections.some((name) => collection === name))
    if (!collection) throw new Error('Invalid collection given')
    setTags({ collection: collections })
    return collectionNames
  }

  const response = await prompts(
    {
      type: 'multiselect',
      name: 'value',
      message: 'Choose project collections',
      choices: validCollections.map(p => {
        return { title: p, value: p }
      }),
      validate: (value: string) => value.length,
    },
    {
      onCancel: () => {
        process.exit(0)
      },
    },
  )

  setTags({ collection: response.value })

  return response.value
}
