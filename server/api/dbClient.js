import path from 'path'
import Database from 'better-sqlite3'

const config = useRuntimeConfig()
const dbPath = `${config.public.dbPath}/db.sqlite3`
const sourcePath = path.resolve(process.cwd(), dbPath)
//const sourcePath = path.join(dbPath)
console.log('Database source path:', sourcePath)
const db = new Database(sourcePath)

export default db