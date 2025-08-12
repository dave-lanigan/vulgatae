import db from './dbClient.js'

export default defineEventHandler((event) => {
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
