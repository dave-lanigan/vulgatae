<!--
Options for verse:
- Copy Text (Latin and English)
- Copy link
- Save
- Commentary
-->

<template>
  <div :id="`verse-${verse.verse}`" class="flex flex-col sm:flex-row items-stretch min-h-full w-full m-2 verse-container" @click="trackVerseRead">
    
    <!-- Icons Container -->
    <div class="options-sidebar flex flex-row sm:flex-col gap-2 sm:gap-1 sm:mb-0">
      <div class="sidebar-option" title="Verse Reference">
        <span class="text-accent text-lg">{{ verse.chapter }}:{{ verse.verse }}</span>
      </div>
      <div class="sidebar-option cursor-pointer hover:text-blue-600" title="Copy Verse Text" @click="copyVerseText">
        <Icon name="lucide:copy" size="16" class="text-gray-400 hover:text-blue-600" />
      </div>
      <div class="sidebar-option cursor-pointer hover:text-blue-600" title="Copy Link to Verse" @click="copyVerseLink">
        <Icon name="lucide:link" size="16" class="text-gray-400 hover:text-blue-600" />
      </div>
      <div class="sidebar-option" title="Bookmark" @click="handleBookmarkToggle">
        <Icon 
          name="lucide:bookmark" 
          size="16" 
          :class="bookmarked ? 'text-primary' : 'text-gray-400'" 
        />
      </div>
      <div class="sidebar-option" title="Note" @click="openNoteModal">
        <Icon 
          name="lucide:notebook-pen" 
          size="16" 
          :class="hasNoteForVerse ? 'text-primary' : 'text-gray-400'" 
        />
      </div>
      <!-- <div class="sidebar-option hover:text-blue-600" title="Share" @click="copyVerseLink">
        <Icon name="lucide:share" size="16" class="text-gray-400" />
      </div> -->
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

    <!-- Note Modal -->
    <dialog ref="noteDialog" class="modal">
      <div class="modal-box relative">
        <button class="btn btn-ghost btn-sm btn-circle absolute right-2 top-2" @click="closeNoteModal" aria-label="Close note dialog">
          <Icon name="lucide:x" size="16" />
        </button>
        <h3 class="font-bold text-lg mb-2">Note — {{ verse.chapter }}:{{ verse.verse }}</h3>
        <textarea 
          v-model="noteText" 
          class="textarea textarea-bordered w-full h-32 text-base" 
          placeholder="Write your note on this verse…"
        ></textarea>
        <div class="modal-action">
          <button v-if="hasNoteForVerse" class="btn btn-error btn-sm btn-outline mr-auto" @click="handleDeleteNote">
            <Icon name="lucide:trash-2" size="14" />
            Delete
          </button>
          <button class="btn btn-primary btn-outline" @click="handleSaveNote" :disabled="!noteText.trim()">Save</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    
  </div>
</template>

<script setup>
const props = defineProps({
  verse: {
    type: Object,
    required: true
  }
})

const route = useRoute()
const { setLastReadVerse } = useLastReadVerse()

// Bookmarks
const { toggleBookmark, isBookmarked, load: loadBookmarks } = useBookmarks()
const bookmarked = ref(false)

// Notes
const { saveNote, removeNote, getNote, hasNote, load: loadNotes } = useNotes()
const noteDialog = ref(null)
const noteText = ref('')
const hasNoteForVerse = ref(false)
const currentNote = ref(null)

const bookNumber = computed(() => props.verse.book || parseInt(route.params.book))

function updateBookmarked() {
  bookmarked.value = isBookmarked(bookNumber.value, props.verse.chapter, props.verse.verse)
}

async function trackVerseRead() {
  await setLastReadVerse(bookNumber.value, props.verse.chapter, props.verse.verse, {
    latin: props.verse.latin?.substring(0, 200),
    english: props.verse.english?.substring(0, 200)
  })
}

async function handleBookmarkToggle() {
  await toggleBookmark(bookNumber.value, props.verse.chapter, props.verse.verse, {
    latin: props.verse.latin?.substring(0, 80),
    english: props.verse.english?.substring(0, 80)
  })
  updateBookmarked()
}

onMounted(async () => {
  await Promise.all([loadBookmarks(), loadNotes()])
  updateBookmarked()
  updateNoteState()
})

// Function to copy verse text to clipboard
const copyVerseText = async () => {
  const text = `${props.verse.latin}\n${props.verse.english}`;
  try {
    await navigator.clipboard.writeText(text);
    console.log(`Copied verse ${props.verse.verse} text`);
  } catch (err) {
    console.error('Failed to copy verse text:', err);
  }
};

// Function to copy verse link to clipboard
const copyVerseLink = async () => {
  const url = `${window.location.origin}${route.path}#verse-${props.verse.verse}`;

  try {
    await navigator.clipboard.writeText(url);
    console.log(`Copied link to verse ${props.verse.verse}: ${url}`);
  } catch (err) {
    console.error('Failed to copy verse link:', err);
  }
};

// Notes
function updateNoteState() {
  hasNoteForVerse.value = hasNote(bookNumber.value, props.verse.chapter, props.verse.verse)
  currentNote.value = getNote(bookNumber.value, props.verse.chapter, props.verse.verse)
}

function openNoteModal() {
  const existing = getNote(bookNumber.value, props.verse.chapter, props.verse.verse)
  noteText.value = existing?.text || ''
  noteDialog.value?.showModal()
}

function closeNoteModal() {
  noteDialog.value?.close()
}

async function handleSaveNote() {
  await saveNote(bookNumber.value, props.verse.chapter, props.verse.verse, noteText.value.trim(), {
    latin: props.verse.latin?.substring(0, 80),
    english: props.verse.english?.substring(0, 80)
  })
  updateNoteState()
  closeNoteModal()
}

async function handleDeleteNote() {
  await removeNote(bookNumber.value, props.verse.chapter, props.verse.verse)
  noteText.value = ''
  updateNoteState()
  closeNoteModal()
}

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
  background-color: oklch(from oklch(60% 0.12 70) l c h / 0.12);
  border: none;
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
