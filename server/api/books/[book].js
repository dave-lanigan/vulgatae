import Database from 'better-sqlite3'

export default defineEventHandler((event) => {
  const { book } = event.context.params
  
  // Use the runtime config for database path
  const config = useRuntimeConfig()
  const db = new Database(config.public.dbPath)
  
  const result = db.prepare('SELECT * FROM books WHERE number = ?').get(book)
  
  if (!result) {
    return null
  }
  
  // Map database column names to frontend property names
  return {
    number: result.number,
    title: result.title,
    titleLatin: result.title_latin,
    altTitle: result.alt_title,
    numberOfChapters: result.number_of_chapters,
    numberOfVerses: result.number_of_verses
  }
})
