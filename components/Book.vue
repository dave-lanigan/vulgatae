<template>
    <NuxtLink 
      :to="`/books/${book.number}/chapters`"
      class="book-card group w-full min-h-20 flex items-center p-4 rounded-lg transition-all duration-200 gap-4">
        
        <!-- Book Icon -->
        <div class="w-14 h-14 relative text-neutral">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
                <path d="M12 3.5C12.8 3.5 13.5 3.9 13.9 4.6L21.2 17.8C21.8 18.9 21 20.5 19.7 20.5H4.3C3 20.5 2.2 18.9 2.8 17.8L10.1 4.6C10.5 3.9 11.2 3.5 12 3.5Z" />
            </svg>
            <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[30%] text-black font-bold text-sm pointer-events-none">
                {{ book.number }}
            </span>
        </div>

        <!-- Book Title -->
        <div class="flex-1 text-left min-w-0">
            <div class="font-semibold text-sm truncate">{{ book.title }}</div>
            <div class="text-xs italic opacity-70 truncate group-hover:text-primary">{{ book.titleLatin }}</div>
        </div>

        <!-- Book details -->
        <div class="flex-shrink-0 text-right text-xs opacity-60">
            <div class="font-semibold">{{ book.numberOfChapters }} chapters</div>
            <div>{{ book.numberOfVerses }} verses</div>
        </div>
    </NuxtLink>
</template>

<script setup>
// Define props to receive book data
defineProps({
    book: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
.book-card {
  cursor: pointer;
  border: 2px solid #f3f4f6; /* lighter gray */
  background-color: hsl(var(--b1));
  color: hsl(var(--bc));
}

.book-card:hover {
  border-color: oklch(28% 0.091 267.935);
  background-color: hsl(var(--p));
  color: hsl(var(--pc));
}

.book-card svg {
  color: #f3f4f6; /* even lighter gray */
  transition: color 0.2s ease;
}

.book-card:hover svg {
  color: oklch(77% 0.152 181.912);
}

.book-card span {
  transition: color 0.2s ease;
}

.book-card:hover span {
  color: hsl(var(--pc)) !important;
}


</style>
