<template>
  <div class="">
    
    <!-- Navigation -->
    <div class="pt-4 pb-4 justify-between bg-base-100 shadow-md overflow-x-hidden">
    
      <div class="mx-auto flex items-center relative sm:static justify-between w-full max-w-screen-lg px-4">
        <!-- Back Arrow: always left -->
        <NuxtLink to="/" class="btn btn-ghost text-xs sm:text-sm md:text-base flex-shrink-0">
          <Icon name="material-symbols:arrow-back" size="20" />
          <span class="hidden sm:inline">Back to Books</span>
        </NuxtLink>

        <!-- Medium and Large Screen Title/Info -->
        <h1 class="book-title font-bold text-xl text-center break-words hidden sm:block">{{ currentBook?.title }} - {{ currentBook?.titleLatin }}</h1>
        <div class="book-ch-vs text-xs opacity-70 text-right break-words hidden sm:block">
          {{ currentBook?.numberOfChapters }} chapters • {{ currentBook?.numberOfVerses }} verses
        </div>

        <!-- Small Screen Component: centered absolutely -->
        <div class="flex flex-col items-center sm:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full w-auto px-4 pointer-events-none">
          <div class="pointer-events-auto w-full">
            <h1 class="font-bold text-xl text-center break-words">{{ currentBook?.titleLatin }}</h1>
            <div class="text-xs opacity-70 text-center break-words">
              {{ currentBook?.numberOfChapters }} chapters • {{ currentBook?.numberOfVerses }} verses
            </div>
          </div>
        </div>
      </div>
    
    </div>
    
    <div class="flex justify-center">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-6 w-3/4">
        <Chapter v-for="chapter in chaptersWithBook" :key="chapter.number" :chapter="chapter" />
      </div>
    </div>
  
  
  </div>
</template>

<script setup>
import { computed } from 'vue';
const route = useRoute();
const bookId = parseInt(route.params.book);

// Import the books data
const { data: books } = await useFetch(`/api/books`);

// Find the current book
const currentBook = computed(() => books.value?.find(book => book.number === bookId));

// Fetch book info and chapters
const { data: chapters } = await useFetch(`/api/books/${bookId}/chapters`);

// Add book property to each chapter for the Chapter component
const chaptersWithBook = computed(() =>
  (chapters.value || []).map(chap => ({ ...chap, book: bookId }))
);

// Set page title
useHead({
  title: `${currentBook.value?.title} - Chapters - Vulgatae`
});
</script>

<style scoped>
.font-serif {
  font-family: 'EB Garamond', serif;
}
</style>
