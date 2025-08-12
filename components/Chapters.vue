<template>
    <div class="container mx-auto p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            <Chapter v-for="chapter in chapters" :key="chapter.chapter" :chapter="chapter" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
  book: {
    type: Object,
    required: true
  }
});
let chapters = [];
let pending = false;
let error = null;
if (props.book && props.book.number !== undefined) {
  const result = await useFetch(`/api/books/${props.book.number}/chapters`);
  chapters = result.data;
  pending = result.pending;
  error = result.error;
}
</script>
