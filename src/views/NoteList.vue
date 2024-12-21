<template>
  <div class="container">
    <div class="flex justify-between items-center mb-8">
      <h1 class="page-title">{{ currentFolder || 'All Notes' }}</h1>
      <button
        @click="createNewNote"
        class="btn btn-primary flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        New Note
      </button>
    </div>

    <div class="notes-grid">
      <div
        v-for="note in notes"
        :key="note.id"
        @click="openNote(note)"
        class="note-card group"
      >
        <h3 class="note-title">{{ note.title }}</h3>
        <p class="note-content line-clamp-3">{{ note.content }}</p>
        <div class="note-meta flex justify-between items-center">
          <span>{{ note.updatedAt | formatDate }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

    <div v-if="notes.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <p class="text-gray-500 text-lg">No notes yet. Create your first note!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { Octokit } from '@octokit/rest'

const route = useRoute()
const router = useRouter()
const notes = ref([])
const token = useLocalStorage('github_token', '')
const repoInfo = useLocalStorage('github_repo_info', { owner: '', repo: '' })

const currentFolder = computed(() => route.params.id)

const octokit = new Octokit({
  auth: token.value
})

onMounted(async () => {
  await loadNotes()
})

async function loadNotes() {
  try {
    const response = await octokit.issues.list({
      owner: repoInfo.value.owner,
      repo: repoInfo.value.repo,
      state: 'open',
      labels: currentFolder.value ? [currentFolder.value] : undefined
    })
    
    notes.value = response.data.map(issue => ({
      id: issue.number,
      title: issue.title,
      content: issue.body,
      updatedAt: issue.updated_at
    }))
  } catch (error) {
    console.error('Failed to load notes:', error)
    alert('Failed to load notes. Please try again.')
  }
}

function createNewNote() {
  router.push({ name: 'new-note' })
}

function openNote(note) {
  router.push({ name: 'note', params: { id: note.id } })
}
</script>
