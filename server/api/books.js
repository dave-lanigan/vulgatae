import Database from 'better-sqlite3'

export default defineEventHandler((event) => {
  // Use the runtime config for database path
  const config = useRuntimeConfig()
  const db = new Database(config.public.dbPath)
  
  const books = db.prepare('SELECT * FROM books').all()
  
  // Map database column names to frontend property names
  return books.map(book => ({
    number: book.number,
    title: book.title,
    titleLatin: book.title_latin,
    altTitle: book.alt_title,
    numberOfChapters: book.number_of_chapters,
    numberOfVerses: book.number_of_verses
  }))
})
