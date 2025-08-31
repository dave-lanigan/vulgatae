import path from 'path'
import fs from 'fs'

export default defineEventHandler(async (event) => {
  const { explore } = event.context.params
  const config = useRuntimeConfig()
  const dbPath = config.public.dbPath
  const filePath = path.resolve(process.cwd(), dbPath, `${explore}.json`)

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const exploreData = JSON.parse(fileContent)

    return exploreData
  } catch (error) {
    console.error('Error reading explore data:', error)
    return null
  }
})