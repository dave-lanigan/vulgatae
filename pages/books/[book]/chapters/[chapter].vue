<template>
  <div class="">

    <!-- Navigation -->
    <div class="pt-4 pb-4 justify-between bg-base-100 shadow-md overflow-x-hidden">
    
      <div class="mx-auto flex items-center relative sm:static justify-between w-full max-w-screen-lg px-4">
        <!-- Back Arrow: always left -->
        <NuxtLink :to="`/books/${currentBook.number}/chapters`" class="btn btn-ghost text-xs sm:text-sm md:text-base flex-shrink-0">
          <Icon name="material-symbols:arrow-back" size="20" />
          <span class="hidden sm:inline">Back to Chapters</span>
        </NuxtLink>

        <!-- Medium and Large Screen Title/Info -->
        <h1 class="book-title font-bold text-xl text-center break-words hidden sm:block">{{ currentBook?.title }} - {{ currentBook?.titleLatin }}</h1>
        <div class="book-ch-vs text-xs opacity-70 text-right break-words hidden sm:block">
          {{ currentBook?.numberOfBooks }} chapters • {{ currentBook?.numberOfVerses }} verses
        </div>

        <!-- Small Screen Component: centered absolutely -->
        <div class="flex flex-col items-center sm:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full w-auto px-4 pointer-events-none">
          <div class="pointer-events-auto w-full">
            <h1 class="font-bold text-xl text-center break-words">{{ currentBook?.titleLatin }}</h1>
            <div class="text-xs opacity-70 text-center break-words">
              {{ currentBook?.numberOfBooks }} chapters • {{ currentBook?.numberOfVerses }} verses
            </div>
          </div>
        </div>
      </div>
    
    </div>

    <!-- Verses Component -->
    <div class="flex flex-col items-center justify-center">
      <Verses />
    </div>
  </div>
</template>

<script setup>
// Get the book ID from the route
const route = useRoute()
const bookId = parseInt(route.params.book)

// Import the books data (you might want to move this to a composable later)
const books = [
    // Old Testament
    { number: 1, title: 'Genesis', titleLatin: 'Genesis', numberOfBooks: 50, numberOfVerses: 1533 },
    { number: 2, title: 'Exodus', titleLatin: 'Exodus', numberOfBooks: 40, numberOfVerses: 1213 },
    { number: 3, title: 'Leviticus', titleLatin: 'Leviticus', numberOfBooks: 27, numberOfVerses: 859 },
    { number: 4, title: 'Numbers', titleLatin: 'Numeri', numberOfBooks: 36, numberOfVerses: 1288 },
    { number: 5, title: 'Deuteronomy', titleLatin: 'Deuteronomium', numberOfBooks: 34, numberOfVerses: 959 },
    { number: 6, title: 'Joshua', titleLatin: 'Josue', numberOfBooks: 24, numberOfVerses: 658 },
    { number: 7, title: 'Judges', titleLatin: 'Judicum', numberOfBooks: 21, numberOfVerses: 618 },
    { number: 8, title: 'Ruth', titleLatin: 'Ruth', numberOfBooks: 4, numberOfVerses: 85 },
    { number: 9, title: '1 Samuel', titleLatin: '1 Regum', numberOfBooks: 31, numberOfVerses: 810 },
    { number: 10, title: '2 Samuel', titleLatin: '2 Regum', numberOfBooks: 24, numberOfVerses: 695 },
    { number: 11, title: '1 Kings', titleLatin: '3 Regum', numberOfBooks: 22, numberOfVerses: 816 },
    { number: 12, title: '2 Kings', titleLatin: '4 Regum', numberOfBooks: 25, numberOfVerses: 719 },
    { number: 13, title: '1 Chronicles', titleLatin: '1 Paralipomenon', numberOfBooks: 29, numberOfVerses: 942 },
    { number: 14, title: '2 Chronicles', titleLatin: '2 Paralipomenon', numberOfBooks: 36, numberOfVerses: 822 },
    { number: 15, title: 'Ezra', titleLatin: '1 Esdras', numberOfBooks: 10, numberOfVerses: 280 },
    { number: 16, title: 'Nehemiah', titleLatin: '2 Esdras', numberOfBooks: 13, numberOfVerses: 406 },
    { number: 17, title: 'Tobit', titleLatin: 'Tobias', numberOfBooks: 14, numberOfVerses: 340 },
    { number: 18, title: 'Judith', titleLatin: 'Judith', numberOfBooks: 16, numberOfVerses: 340 },
    { number: 19, title: 'Esther', titleLatin: 'Esther', numberOfBooks: 10, numberOfVerses: 167 },
    { number: 20, title: 'Job', titleLatin: 'Job', numberOfBooks: 42, numberOfVerses: 1070 },
    { number: 21, title: 'Psalms', titleLatin: 'Psalmi', numberOfBooks: 150, numberOfVerses: 2461 },
    { number: 22, title: 'Proverbs', titleLatin: 'Proverbia', numberOfBooks: 31, numberOfVerses: 915 },
    { number: 23, title: 'Ecclesiastes', titleLatin: 'Ecclesiastes', numberOfBooks: 12, numberOfVerses: 222 },
    { number: 24, title: 'Song of Songs', titleLatin: 'Canticum Canticorum', numberOfBooks: 8, numberOfVerses: 117 },
    { number: 25, title: 'Wisdom', titleLatin: 'Sapientia', numberOfBooks: 19, numberOfVerses: 435 },
    { number: 26, title: 'Sirach', titleLatin: 'Ecclesiasticus', numberOfBooks: 51, numberOfVerses: 1389 },
    { number: 27, title: 'Isaiah', titleLatin: 'Isaias', numberOfBooks: 66, numberOfVerses: 1292 },
    { number: 28, title: 'Jeremiah', titleLatin: 'Jeremias', numberOfBooks: 52, numberOfVerses: 1364 },
    { number: 29, title: 'Lamentations', titleLatin: 'Lamentationes', numberOfBooks: 5, numberOfVerses: 154 },
    { number: 30, title: 'Baruch', titleLatin: 'Baruch', numberOfBooks: 6, numberOfVerses: 213 },
    { number: 31, title: 'Ezekiel', titleLatin: 'Ezechiel', numberOfBooks: 48, numberOfVerses: 1273 },
    { number: 32, title: 'Daniel', titleLatin: 'Daniel', numberOfBooks: 14, numberOfVerses: 357 },
    { number: 33, title: 'Hosea', titleLatin: 'Osee', numberOfBooks: 14, numberOfVerses: 197 },
    { number: 34, title: 'Joel', titleLatin: 'Joel', numberOfBooks: 3, numberOfVerses: 73 },
    { number: 35, title: 'Amos', titleLatin: 'Amos', numberOfBooks: 9, numberOfVerses: 146 },
    { number: 36, title: 'Obadiah', titleLatin: 'Abdias', numberOfBooks: 1, numberOfVerses: 21 },
    { number: 37, title: 'Jonah', titleLatin: 'Jonas', numberOfBooks: 4, numberOfVerses: 48 },
    { number: 38, title: 'Micah', titleLatin: 'Micheas', numberOfBooks: 7, numberOfVerses: 105 },
    { number: 39, title: 'Nahum', titleLatin: 'Nahum', numberOfBooks: 3, numberOfVerses: 47 },
    { number: 40, title: 'Habakkuk', titleLatin: 'Habacuc', numberOfBooks: 3, numberOfVerses: 56 },
    { number: 41, title: 'Zephaniah', titleLatin: 'Sophonias', numberOfBooks: 3, numberOfVerses: 53 },
    { number: 42, title: 'Haggai', titleLatin: 'Aggeus', numberOfBooks: 2, numberOfVerses: 38 },
    { number: 43, title: 'Zechariah', titleLatin: 'Zacharias', numberOfBooks: 14, numberOfVerses: 211 },
    { number: 44, title: 'Malachi', titleLatin: 'Malachias', numberOfBooks: 4, numberOfVerses: 55 },
    { number: 45, title: '1 Maccabees', titleLatin: '1 Machabaeorum', numberOfBooks: 16, numberOfVerses: 924 },
    { number: 46, title: '2 Maccabees', titleLatin: '2 Machabaeorum', numberOfBooks: 15, numberOfVerses: 555 },
    
    // New Testament
    { number: 47, title: 'Matthew', titleLatin: 'Matthaeus', numberOfBooks: 28, numberOfVerses: 1071 },
    { number: 48, title: 'Mark', titleLatin: 'Marcus', numberOfBooks: 16, numberOfVerses: 678 },
    { number: 49, title: 'Luke', titleLatin: 'Lucas', numberOfBooks: 24, numberOfVerses: 1151 },
    { number: 50, title: 'John', titleLatin: 'Joannes', numberOfBooks: 21, numberOfVerses: 879 },
    { number: 51, title: 'Acts', titleLatin: 'Actus Apostolorum', numberOfBooks: 28, numberOfVerses: 1007 },
    { number: 52, title: 'Romans', titleLatin: 'Romanos', numberOfBooks: 16, numberOfVerses: 433 },
    { number: 53, title: '1 Corinthians', titleLatin: '1 Corinthios', numberOfBooks: 16, numberOfVerses: 437 },
    { number: 54, title: '2 Corinthians', titleLatin: '2 Corinthios', numberOfBooks: 13, numberOfVerses: 257 },
    { number: 55, title: 'Galatians', titleLatin: 'Galatas', numberOfBooks: 6, numberOfVerses: 149 },
    { number: 56, title: 'Ephesians', titleLatin: 'Ephesios', numberOfBooks: 6, numberOfVerses: 155 },
    { number: 57, title: 'Philippians', titleLatin: 'Philippenses', numberOfBooks: 4, numberOfVerses: 104 },
    { number: 58, title: 'Colossians', titleLatin: 'Colossenses', numberOfBooks: 4, numberOfVerses: 95 },
    { number: 59, title: '1 Thessalonians', titleLatin: '1 Thessalonicenses', numberOfBooks: 5, numberOfVerses: 89 },
    { number: 60, title: '2 Thessalonians', titleLatin: '2 Thessalonicenses', numberOfBooks: 3, numberOfVerses: 47 },
    { number: 61, title: '1 Timothy', titleLatin: '1 Timotheum', numberOfBooks: 6, numberOfVerses: 113 },
    { number: 62, title: '2 Timothy', titleLatin: '2 Timotheum', numberOfBooks: 4, numberOfVerses: 83 },
    { number: 63, title: 'Titus', titleLatin: 'Titum', numberOfBooks: 3, numberOfVerses: 46 },
    { number: 64, title: 'Philemon', titleLatin: 'Philemonem', numberOfBooks: 1, numberOfVerses: 25 },
    { number: 65, title: 'Hebrews', titleLatin: 'Hebraeos', numberOfBooks: 13, numberOfVerses: 303 },
    { number: 66, title: 'James', titleLatin: 'Jacobus', numberOfBooks: 5, numberOfVerses: 108 },
    { number: 67, title: '1 Peter', titleLatin: '1 Petrus', numberOfBooks: 5, numberOfVerses: 105 },
    { number: 68, title: '2 Peter', titleLatin: '2 Petrus', numberOfBooks: 3, numberOfVerses: 61 },
    { number: 69, title: '1 John', titleLatin: '1 Joannes', numberOfBooks: 5, numberOfVerses: 105 },
    { number: 70, title: '2 John', titleLatin: '2 Joannes', numberOfBooks: 1, numberOfVerses: 13 },
    { number: 71, title: '3 John', titleLatin: '3 Joannes', numberOfBooks: 1, numberOfVerses: 14 },
    { number: 72, title: 'Jude', titleLatin: 'Judas', numberOfBooks: 1, numberOfVerses: 25 },
    { number: 73, title: 'Revelation', titleLatin: 'Apocalypsis', numberOfBooks: 22, numberOfVerses: 404 }
]

// Find the current book
const currentBook = computed(() => books.find(book => book.number === bookId))

// Set page title
useHead({
  title: `${currentBook.value?.title} - Vulgatae.com`
})
</script>
