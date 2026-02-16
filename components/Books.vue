<template>
    <div class="container mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            <Book
                v-for="book in books"
                :key="book.number"
                :book="book"
                @select="onSelectBook(book)"
            />
        </div>
    </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import Book from './Book.vue';

const emit = defineEmits(['select-book']);

function onSelectBook(book) {
  emit('select-book', book);
}

const { data: books } = await useFetch('/api/books');

</script>

<style scoped>
</style>