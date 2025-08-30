<template>
  <NuxtLink
    :to="`/books/${chapter.book}/chapters/${chapter.chapter}`"
    class="chapter-card-horizontal group bg-white/80 cursor-pointer rounded-xl px-6 py-4 flex flex-col w-full max-w-xl mx-auto border-2 border-gray-200 hover:border-primary"
  >
    <div class="flex items-center w-full">
      <Icon 
        name="lucide:book-open-text"
        size="34"
        class="text-gray-200 transition-colors duration-200 ease-in-out group-hover:text-accent"
      />
      <div class="m-4">
        <div class="font-bold">Capitulum {{ convertNumberToRomanNumerals(chapter.chapter) }}</div>
        <p class="text-xs text-gray-500" v-if="chapter.verseCount !== undefined">
          {{ chapter.verseCount }} verse{{ chapter.verseCount === 1 ? '' : 's' }}
        </p>
      </div>
    </div>
    <div class="chapter-header text-sm text-gray-800 whitespace-pre-line" v-if="chapter.header">
      {{ chapter.header }}
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  chapter: {
    type: Object,
    required: true
  }
})

const convertNumberToRomanNumerals = (num) => {
  if (num <= 0 || num > 3999) return num.toString(); // Return original if out of range
  
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const numerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  
  let result = '';
  
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += numerals[i];
      num -= values[i];
    }
  }
  
  return result;
}
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
</style>