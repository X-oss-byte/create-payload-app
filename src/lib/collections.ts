import path from 'path'
import fs from 'fs'
import { error, info } from '../utils/log'

export async function validateCollections(collections: string): Promise<boolean> {
  const validCollections = await getValidCollections()
  collections.split(',').forEach((inputCollection) => {
    if (!validCollections.includes(inputCollection.replaceAll(' ', ''))) {
      error(`'${inputCollection}' is not a valid collection.`)
      info(`Valid collections: ${validCollections.join(', ')}`)
      return false
    }
  })
  return true
}

export async function getValidCollections(): Promise<string[]> {
  const templateDir = path.resolve(__dirname, '../collections')
  return getDirectories(templateDir)
}

function getDirectories(dir: string) {
  return fs.readdirSync(dir).filter(file => {
    return fs.statSync(dir + '/' + file).isDirectory()
  })
}
