import path from 'path'
import Database from 'better-sqlite3'

const config = useRuntimeConfig()
const sourcePath = path.resolve(process.cwd(), 'server/api/v.db')
console.log('Database source path:', sourcePath)
const db = new Database(sourcePath)

export default db