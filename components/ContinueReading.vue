<template>
  <div class="mx-auto max-w-full">
    <div class="m-6">
      <h2 class="text-2xl font-bold font-serif text-primary">{{ sectionTitle }}</h2>
    </div>

    <div class="m-6">
      <NuxtLink
        :to="continuePath"
        class="card w-full bg-transparent shadow-[0_6px_16px_rgba(0,0,0,0.18)] border border-base-300 transition-colors group block"
      >
        <div class="card-body flex flex-col items-start gap-2 p-5 sm:p-6 h-full">
          <div class="w-full">
            <h3 class="card-title text-left text-accent text-xl font-bold leading-tight mb-1">{{ locationLabel }}</h3>
          </div>

          <p class="text-left w-full text-2xl sm:text-lg text-primary font-serif leading-snug break-words line-clamp-3 mb-1">
            {{ latinPreview }}
          </p>

          <p class="text-left w-full text-xl sm:text-sm text-base-content/85 mb-1 leading-relaxed break-words line-clamp-2">
            {{ versePreview }}
          </p>

          <div class="w-full mt-1">
            <div class="flex items-center justify-end w-full">
              <span class="btn btn-sm btn-outline btn-primary rounded-full normal-case font-normal">{{ ctaLabel }}</span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { lastReadVerse, load } = useLastReadVerse()
const { data: books } = await useFetch('/api/books')

onMounted(() => {
  load()
})

const currentBook = computed(() => {
  if (!lastReadVerse.value?.book) return books.value?.find(book => book.number === 1) || null
  return books.value?.find(book => book.number === Number(lastReadVerse.value.book)) || null
})

const continuePath = computed(() => {
  if (!lastReadVerse.value) return '/books/1/chapters/1#verse-1'
  return `/books/${lastReadVerse.value.book}/chapters/${lastReadVerse.value.chapter}#verse-${lastReadVerse.value.verse}`
})

const locationLabel = computed(() => {
  const title = currentBook.value?.title || 'Genesis'
  if (!lastReadVerse.value) return `${title} 1:1`
  return `${title} ${lastReadVerse.value.chapter}:${lastReadVerse.value.verse}`
})

const versePreview = computed(() => {
  if (!lastReadVerse.value) return 'In the beginning God created heaven and earth.'
  return lastReadVerse.value.english || lastReadVerse.value.latin || ''
})

const latinPreview = computed(() => {
  if (!lastReadVerse.value) return 'In principio creavit Deus caelum et terram.'
  return lastReadVerse.value.latin || 'Revertere ad locum ubi legebas.'
})

const ctaLabel = computed(() => {
  if (!lastReadVerse.value) return 'Incipe'
  return 'Resumere'
})

const sectionTitle = computed(() => {
  if (!lastReadVerse.value) return 'Start Reading'
  return 'Continue Reading'
})

const categoryLabel = computed(() => {
  if (!lastReadVerse.value) return 'Beginning'
  return 'Your Reading'
})

const sourceLabel = computed(() => {
  if (!lastReadVerse.value) return 'Genesis 1:1'
  return locationLabel.value
})

const metaLabel = computed(() => {
  if (!lastReadVerse.value) return 'First verse'
  return 'Saved location'
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Crimson+Text:wght@400;600&display=swap');

.font-serif {
  font-family: 'EB Garamond', serif;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
