import Database from 'better-sqlite3'
const db = new Database('server/api/v.db')

export default defineEventHandler(() => {
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
