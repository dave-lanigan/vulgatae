<template>
  <NuxtLink
    :to="`/books/${chapter.book}/chapters/${chapter.chapter}`"
    class="chapter-card-horizontal bg-white/80 cursor-pointer rounded-xl px-6 py-4 flex flex-col w-full max-w-xl mx-auto border-2 border-gray-200 hover:border-black"
  >
    <div class="flex items-center w-full mb-2">
      <span class="chapter-label font-bold rounded py-1 mr-3">Capitulum {{ chapter.chapter }}</span>
      <span class="text-xs text-gray-500 ml-auto" v-if="chapter.verseCount !== undefined">
        {{ chapter.verseCount }} verse{{ chapter.verseCount === 1 ? '' : 's' }}
      </span>
    </div>
    <div class="chapter-header text-sm text-gray-800 whitespace-pre-line" v-if="chapter.header">{{ chapter.header }}</div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  chapter: {
    type: Object,
    required: true
  }
})
console.log('Chapter component loaded:', props.chapter.book)
</script>
<style scoped>
.chapter-card-horizontal {
  min-height: 64px;
  max-width: 480px;
  margin: 8px auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.chapter-label {
  display: inline-block;
}
/* Match Books.vue card title style for chapter header */
.chapter-header {
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif;
  letter-spacing: 0.01em;
}
</style>