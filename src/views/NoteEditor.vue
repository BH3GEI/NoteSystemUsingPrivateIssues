<template>
  <div class="container h-full flex flex-col">
    <div class="flex justify-between items-center mb-6">
      <input
        v-model="title"
        class="text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 flex-1 mr-4"
        placeholder="Note Title"
      />
      <div class="flex gap-3">
        <button
          @click="$router.push('/')"
          class="btn flex items-center gap-2 border border-gray-300 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Back
        </button>
        <button
          @click="saveNote"
          class="btn btn-primary flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Save
        </button>
      </div>
    </div>

    <div class="flex-1 grid grid-cols-2 gap-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Editor Pane -->
      <div class="p-6 overflow-auto">
        <textarea
          v-model="content"
          class="w-full h-full resize-none bg-transparent border-none focus:outline-none font-mono text-gray-700"
          placeholder="Write your note here... (Markdown supported)"
        ></textarea>
      </div>

      <!-- Preview Pane -->
      <div 
        class="border-l border-gray-200 p-6 overflow-auto prose prose-sm max-w-none bg-gray-50"
        v-html="renderedContent"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { Octokit } from '@octokit/rest'
import { marked } from 'marked'
import 'highlight.js/styles/github.css'

const route = useRoute()
const router = useRouter()
const token = useLocalStorage('github_token', '')
const repoInfo = useLocalStorage('github_repo_info', { owner: '', repo: '' })
const title = ref('')
const content = ref('')

const octokit = new Octokit({
  auth: token.value
})

const renderedContent = computed(() => {
  return marked(content.value)
})

onMounted(async () => {
  if (route.params.id) {
    await loadNote()
  }
})

async function loadNote() {
  try {
    const response = await octokit.issues.get({
      owner: repoInfo.value.owner,
      repo: repoInfo.value.repo,
      issue_number: route.params.id
    })
    
    title.value = response.data.title
    content.value = response.data.body
  } catch (error) {
    console.error('Failed to load note:', error)
    alert('Failed to load note. Please try again.')
  }
}

async function saveNote() {
  try {
    if (route.params.id) {
      // Update existing note
      await octokit.issues.update({
        owner: repoInfo.value.owner,
        repo: repoInfo.value.repo,
        issue_number: route.params.id,
        title: title.value,
        body: content.value
      })
    } else {
      // Create new note
      await octokit.issues.create({
        owner: repoInfo.value.owner,
        repo: repoInfo.value.repo,
        title: title.value,
        body: content.value
      })
    }
    router.push('/')
  } catch (error) {
    console.error('Failed to save note:', error)
    alert('Failed to save note. Please try again.')
  }
}
</script>
