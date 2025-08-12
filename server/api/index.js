import path from 'path'

const config = useRuntimeConfig()
const dbPath = config.public.dbPath

import { readdirSync, statSync } from 'fs'
import { join } from 'path'

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath)
  
  files.forEach(file => {
    const fullPath = join(dirPath, file)
    if (statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles)
    } else {
      arrayOfFiles.push(fullPath)
    }
  })
  
  return arrayOfFiles
}

export default defineEventHandler(() => {
  // Get all files in the project
  const allFiles = getAllFiles(process.cwd())
  
  // Console log all files
  console.log('All files in project:')
  allFiles.forEach(file => console.log(file))
  
  return {
    aboutAPI: "API for the Vulgate/Douay-Rheims Bible",
    about: "The Vulgate is a version of the Bible",
    contact: "bohemdev@tutanota.com",
    totalFiles: allFiles.length,
    files: allFiles
  }
})
