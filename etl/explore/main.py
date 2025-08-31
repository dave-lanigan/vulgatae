"""
Convert the .txt files to .json for use in app
"""

FILE_NAMES = [
    "comforting.txt",
    #"inspirational.txt",
    "instructional.txt"
]

BIBLE_BOOKS = {
    "Genesis": 1,
    "Exodus": 2,
    "Leviticus": 3,
    "Numbers": 4,
    "Deuteronomy": 5,
    "Joshua": 6,
    "Judges": 7,
    "Ruth": 8,
    "1 Samuel": 9,
    "2 Samuel": 10,
    "1 Kings": 11,
    "2 Kings": 12,
    "1 Chronicles": 13,
    "2 Chronicles": 14,
    "Ezra": 15,
    "Nehemiah": 16,
    "Esther": 17,
    "Job": 18,
    "Psalm": 19,
    "Psalms": 19,
    "Proverbs": 20,
    "Ecclesiastes": 21,
    "Sirach": 21,
    "Song of Solomon": 22,
    "Isaiah": 23,
    "Jeremiah": 24,
    "Lamentations": 25,
    "Ezekiel": 26,
    "Daniel": 27,
    "Hosea": 28,
    "Joel": 29,
    "Amos": 30,
    "Obadiah": 31,
    "Jonah": 32,
    "Micah": 33,
    "Nahum": 34,
    "Habakkuk": 35,
    "Zephaniah": 36,
    "Haggai": 37,
    "Zechariah": 38,
    "Malachi": 39,
    "Matthew": 40,
    "Mark": 41,
    "Luke": 42,
    "John": 43,
    "Acts": 44,
    "Romans": 45,
    "1 Corinthians": 46,
    "2 Corinthians": 47,
    "Galatians": 48,
    "Ephesians": 49,
    "Philippians": 50,
    "Colossians": 51,
    "1 Thessalonians": 52,
    "2 Thessalonians": 53,
    "1 Timothy": 54,
    "2 Timothy": 55,
    "Titus": 56,
    "Philemon": 57,
    "Hebrews": 58,
    "James": 59,
    "1 Peter": 60,
    "2 Peter": 61,
    "1 John": 62,
    "2 John": 63,
    "3 John": 64,
    "Jude": 65,
    "Revelation": 66
}

for file_name in FILE_NAMES:
    with open(f"etl/explore/raw/{file_name}", "r", encoding="utf-8") as f:
        lines = f.readlines()

    data = []
    for line in lines:
        line = line.strip()
        if line:
            info = line.split(" ")
            verse_info = info[-1].split(":")
            book = line.replace(f" {info[-1]}", "")
            try:
                book_number = BIBLE_BOOKS.get(book, 0)
                data.append(
                    {
                        "book": book,
                        "bookNumber": book_number,
                        "chapter": int(verse_info[0]),
                        "verse": verse_info[1],
                    }
                )
            except Exception as e:
                print(f"Error processing line: {line} - {e}")

    json_file_name = file_name.replace(".txt", ".json")
    with open(f"etl/explore/{json_file_name}", "w", encoding="utf-8") as f:
        import json
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Converted {file_name} to {json_file_name}")