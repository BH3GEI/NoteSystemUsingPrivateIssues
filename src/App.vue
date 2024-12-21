<template>
  <div class="min-h-screen bg-background">
    <template v-if="isAuthenticated">
      <div class="flex h-screen">
        <!-- Sidebar -->
        <aside class="w-64 bg-surface border-r border-gray-200">
          <div class="p-4">
            <h1 class="text-xl font-semibold text-primary">Notes</h1>
          </div>
          <nav class="mt-4">
            <router-link 
              v-for="folder in folders"
              :key="folder.id"
              :to="{ name: 'folder', params: { id: folder.id }}"
              class="block px-4 py-2 hover:bg-gray-100"
            >
              {{ folder.name }}
            </router-link>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto">
          <router-view></router-view>
        </main>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-center min-h-screen">
        <div class="w-96 p-6 bg-surface rounded-lg shadow-lg">
          <h2 class="text-2xl font-semibold mb-4">Welcome to Notes</h2>
          <p class="mb-4 text-gray-600">Please enter your GitHub Personal Access Token to continue</p>
          <input
            v-model="token"
            type="password"
            class="w-full p-2 border rounded mb-4"
            placeholder="GitHub PAT Token"
          />
          <button
            @click="authenticate"
            class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { Octokit } from '@octokit/rest'

const router = useRouter()
const token = ref('')
const folders = ref([])
const storedToken = useLocalStorage('github_token', '')
const isAuthenticated = ref(false)
const repoInfo = useLocalStorage('github_repo_info', { owner: '', repo: '' })

onMounted(() => {
  if (storedToken.value) {
    isAuthenticated.value = true
    loadFolders()
  }
})

async function authenticate() {
  if (token.value) {
    try {
      const octokit = new Octokit({ auth: token.value })
      
      // 获取用户信息
      const { data: user } = await octokit.users.getAuthenticated()
      
      // 创建仓库名称
      const repoName = 'private-notes-' + Date.now()
      
      // 创建私有仓库
      const { data: repo } = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: true,
        auto_init: true,
        description: 'Private notes repository created by Note System'
      })
      
      // 保存仓库信息
      repoInfo.value = {
        owner: user.login,
        repo: repoName
      }
      
      // 保存token并更新认证状态
      storedToken.value = token.value
      isAuthenticated.value = true
      await loadFolders()
      router.push('/')
    } catch (error) {
      console.error('Authentication failed:', error)
      alert('Failed to authenticate or create repository. Please check your token.')
    }
  }
}

async function loadFolders() {
  // TODO: Implement folder loading from GitHub labels
  folders.value = []
}
</script>
