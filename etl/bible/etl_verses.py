import time
import sqlite3
import requests
from bs4 import BeautifulSoup
from outline import bible_books

def convert_chapter(chapter):
    # Convert chapter number to two-digit string
    return f"{chapter:03d}"


def extract_chapter_header(text):
    soup = BeautifulSoup(text, 'html.parser')
    
    # Look for the chapter header in a paragraph with class="desc"
    desc_paragraph = soup.find('p', class_='desc')
    if desc_paragraph:
        return desc_paragraph.get_text(strip=True)
    
    return ""


def extract_verses(book, chapter, text):
    soup = BeautifulSoup(text, 'html.parser')
    verses = []
    
    # Find all paragraph tags that contain verse links
    verse_paragraphs = soup.find_all('p')
    
    for p in verse_paragraphs:
        # Look for verse number link within the paragraph
        verse_link = p.find('a', class_='vn')
        if verse_link:
            # Extract verse number from the link text
            verse_text = verse_link.get_text(strip=True)
            if verse_text.isdigit():
                verse_num = int(verse_text)
                
                # Get all text content from the paragraph
                full_text = p.get_text()
                
                # Split by the verse number to get the content after it
                parts = full_text.split(verse_text, 1)
                if len(parts) > 1:
                    content = parts[1].strip()
                    
                    # Find the Latin text in font tag
                    latin_font = p.find('font', class_='latin')
                    latin_text = latin_font.get_text(strip=True) if latin_font else ''
                    
                    # Extract English text (everything before the Latin)
                    if latin_text:
                        # Remove the Latin text from content to get English
                        english_text = content.replace(latin_text, '').strip()
                        # Clean up any remaining formatting
                        english_text = english_text.replace('\n', ' ').replace('\r', ' ')
                        english_text = ' '.join(english_text.split())  # normalize whitespace
                    else:
                        english_text = content
                    
                    verses.append({
                        "book": book['number'],
                        "chapter": chapter,
                        "verse": verse_num,
                        "english": english_text,
                        "latin": latin_text
                    })
    
    return verses


def update_verses_db(verses):
    conn = sqlite3.connect('bible.db')
    c = conn.cursor()
    for verse in verses:
        c.execute('''
            INSERT OR REPLACE INTO verses (book, chapter, verse, english, latin)
            VALUES (?, ?, ?, ?, ?)
        ''', (verse['book'], verse['chapter'], verse['verse'], verse['english'], verse['latin']))
    conn.commit()
    conn.close()


def update_chapters_db(chapter):
    conn = sqlite3.connect('bible.db')
    c = conn.cursor()
    c.execute('''
        INSERT OR REPLACE INTO chapters (book, chapter, header, number_of_verses)
        VALUES (?, ?, ?, ?)
    ''', (chapter['book'], chapter['number'], chapter['header'], chapter['number_of_verses']))
    conn.commit()
    conn.close()

def scrape():

    conn = sqlite3.connect('bible.db')
    c = conn.cursor()
    c.execute('''
    CREATE TABLE IF NOT EXISTS verses (
        book INTEGER,
        chapter INTEGER,
        verse INTEGER,
        english TEXT,
        latin TEXT,
        PRIMARY KEY (book, chapter, verse)
    )
    ''')
    c.execute('''
    CREATE TABLE IF NOT EXISTS chapters (
        book INTEGER,
        chapter INTEGER,
        number_of_verses INTEGER,
        header TEXT,
        PRIMARY KEY (book, chapter)
    )
    ''')
    conn.commit()
    
    for book in bible_books[61:]:
        for chapter in range(1, book['numberOfChapters'] + 1):
            BOOK = book['drbo_number']
            CHAPTER = convert_chapter(chapter)
            url = f"https://www.drbo.org/drl/chapter/{BOOK}{CHAPTER}.htm"
            print(f"Scraping page for: {url}")
            resp = requests.get(url)
            resp.raise_for_status()  # abort on error
            
            # Extract verses
            verses = extract_verses(book, chapter, resp.text)
            assert len(verses) > 0
            
            update_verses_db(verses)
            chapter_header = extract_chapter_header(resp.text)
            chapter_data = {
                'book': book['number'],
                'number': chapter,
                'header': chapter_header,
                'number_of_verses': len(verses)
            }
            update_chapters_db(chapter_data)

            print(f"Found {len(verses)} verses in {book['title']} chapter {chapter}")
            print()
            time.sleep(2)

if __name__ == "__main__":
    scrape()