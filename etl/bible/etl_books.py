import json
import sqlite3


def main():
    conn = sqlite3.connect('etl/bible.db')
    c = conn.cursor()
    c.execute('''
    CREATE TABLE IF NOT EXISTS books (
        number INTEGER,
        book INTEGER,
        title TEXT,
        title_latin TEXT,
        alt_title TEXT,
        number_of_chapters INTEGER,
        number_of_verses INTEGER,
        PRIMARY KEY (number)
    )
    ''')

    with open('etl/bible/books.json') as f:
        bible_books = json.load(f)

    for book in bible_books:
        print(f"Inserting book {book['number']}: {book['title']}")
        try:
            c.execute('''
            INSERT OR REPLACE INTO books (number, book, title, title_latin, alt_title, number_of_chapters, number_of_verses)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (book['number'], book['number'], book['title'], book['titleLatin'], book.get('altTitle'), book['numberOfChapters'], book['numberOfVerses']))
        except Exception as e:
            print(f"Error inserting book {book['number']}: {e}")

    conn.commit()
    conn.close()
    print("Database updated and closed successfully")

if __name__ == '__main__':
    main()