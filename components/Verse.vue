<!--
Options for verse:
- Copy Text (Latin and English)
- Copy link
- Save
- Commentary
-->

<template>
  <div :id="`verse-${verse.verse}`" class="flex flex-col sm:flex-row items-stretch min-h-full w-full m-2 verse-container">
    
    <!-- Icons Container -->
    <div class="options-sidebar flex flex-row sm:flex-col gap-2 sm:gap-1 sm:mb-0">
      <div class="sidebar-option" title="Verse Reference">
        <span class="text-black text-lg">{{ verse.chapter }}:{{ verse.verse }}</span>
      </div>
      <div class="sidebar-option cursor-pointer hover:text-blue-600" title="Copy Link to Verse" @click="copyVerseLink">
        <Icon name="lucide:copy" size="16" class="text-gray-400 hover:text-blue-600" />
      </div>
      <div class="sidebar-option cursor-pointer hover:text-blue-600" title="Copy Link to Verse" @click="copyVerseLink">
        <Icon name="lucide:link" size="16" class="text-gray-400 hover:text-blue-600" />
      </div>
      <div class="sidebar-option cursor-pointer hover:text-blue-600" title="Play Verse">
        <Icon name="lucide:play" size="16" class="text-gray-400 hover:text-blue-600" />
      </div>
      <!-- <div class="sidebar-option cursor-pointer hover:text-blue-600" title="Play Latin" @click="playLatin">
        <div class="flex flex-col items-start">
          <Icon name="lucide:play" size="14" class="text-gray-400 hover:text-blue-600" />
          <span class="text-xs text-gray-400 ml-2">L</span>
        </div>
      </div>
      <div class="sidebar-option cursor-pointer hover:text-blue-600" title="Play English" @click="playEnglish">
        <div class="flex flex-col items-start">
          <Icon name="lucide:play" size="14" class="text-gray-400 hover:text-blue-600" />
          <span class="text-xs text-gray-400 ml-2">E</span>
        </div>
      </div> -->
      <div class="sidebar-option" title="Bookmark">
        <Icon name="lucide:bookmark" size="16" class="text-gray-400" />
      </div>
      <!-- <div class="sidebar-option hover:text-blue-600" title="Share" @click="copyVerseLink">
        <Icon name="lucide:share" size="16" class="text-gray-400" />
      </div> -->
      <div class="sidebar-option" title="Book">
        <Icon name="lucide:book" size="16" class="text-gray-400" />
      </div>
    </div>

    <!-- Verse Container -->
    <div class="verse-content flex-1 flex flex-col justify-between m-4">
      <div class="verse-latin text-right text-2xl sm:text-lg m-4" style="font-size: x-large;">
        {{ verse.latin }}
      </div>
      <div class="verse-english text-left text-xl sm:text-sm m-4" style="font-size: large;">
        {{ verse.english }}
      </div>
    </div>
    
  </div>
</template>

<script setup>
const props = defineProps({
  verse: {
    type: Object,
    required: true
  }
})

console.log("Verse", props.verse)

const route = useRoute()

// Function to copy verse link to clipboard
const copyVerseLink = async () => {
  const url = `${window.location.origin}${route.path}#verse-${props.verse.verse}`;

  try {
    await navigator.clipboard.writeText(url);
    // You could add a toast notification here
    console.log(`Copied link to verse ${props.verse.verse}: ${url}`);
    
    // Optional: Show a brief visual feedback
    // You could emit an event to show a toast notification
  } catch (err) {
    console.error('Failed to copy verse link:', err);
  }
};

// Function to play Latin text
const playLatin = () => {
  console.log('Playing Latin:', props.verse.latin);
  // You can implement text-to-speech here
  // speechSynthesis.speak(new SpeechSynthesisUtterance(props.verse.latin));
};

// Function to play English text
const playEnglish = () => {
  console.log('Playing English:', props.verse.english);
  // You can implement text-to-speech here
  // speechSynthesis.speak(new SpeechSynthesisUtterance(props.verse.english));
};

// Scroll to this verse if it matches the URL hash
onMounted(() => {
  if (route.hash === `#verse-${props.verse.verse}`) {
    nextTick(() => {
      const element = document.getElementById(`verse-${props.verse.verse}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a brief highlight effect
        element.classList.add('highlighted');
        setTimeout(() => {
          element.classList.remove('highlighted');
        }, 2000);
      }
    });
  }
});
</script>

<style scoped>
.verse-container {
  transition: all 0.3s ease;
  scroll-margin-top: 2rem;
}

.verse-container.highlighted {
  background-color: rgba(59, 130, 246, 0.1);
  border-left: 4px solid #3b82f6;
  transform: scale(1.02);
}

.sidebar-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-option:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.sidebar-option svg {
  color: #9ca3af; /* Light gray color for icons */
  transition: color 0.2s ease;
}

.sidebar-option:hover svg {
  color: #3b82f6; /* Blue on hover */
}

.verse-latin {
  font-family: 'EB Garamond', serif;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.verse-english {
  font-family: 'Crimson Text', serif;
  letter-spacing: 0.01em;
}
</style>
