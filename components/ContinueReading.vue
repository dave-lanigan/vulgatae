<template>
  <div class="mx-auto max-w-full">
    <div class="m-6">
      <h2 class="text-lg sm:text-2xl font-bold font-serif text-primary">{{ sectionTitle }}</h2>
    </div>

    <div class="m-6">
      <NuxtLink
        :to="continuePath"
        class="card rounded-xl w-full bg-gradient-to-br from-accent via-accent to-primary shadow-[0_8px_22px_rgba(0,0,0,0.2)] border border-secondary/50 transition-colors group block text-accent-content"
      >
        <div class="card-body flex flex-col items-start gap-2 p-5 sm:p-6 h-full">
          <div class="w-full">
            <h3 class="card-title text-left text-accent-content text-lg font-semibold leading-tight mb-0.5">{{ locationLabelLatin }}</h3>
            <p class="text-left text-xs text-accent-content/80 uppercase tracking-wider mb-2">{{ locationLabel }}</p>
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="badge badge-sm border-0 bg-base-100/90 text-primary">{{ metaLabel }}</span>
            </div>
          </div>

          <p class="verse-english text-left w-full text-accent-content/90 mb-1 leading-relaxed break-words line-clamp-2" style="font-size: large;">
            {{ versePreview }}
          </p>

          <div class="w-full mt-1">
            <div class="flex items-center justify-end w-full">
              <span class="btn btn-secondary btn-sm border-0 inline-flex items-center gap-1 font-normal">
                {{ ctaLabel }}
              </span>
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

const locationLabelLatin = computed(() => {
  const titleLatin = currentBook.value?.titleLatin || 'Genesis'
  if (!lastReadVerse.value) return `${titleLatin} 1:1`
  return `${titleLatin} ${lastReadVerse.value.chapter}:${lastReadVerse.value.verse}`
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

.verse-english {
  font-family: 'Crimson Text', serif;
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
