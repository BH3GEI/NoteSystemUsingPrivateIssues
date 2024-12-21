import NoteList from '../views/NoteList.vue'
import NoteEditor from '../views/NoteEditor.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: NoteList
  },
  {
    path: '/folder/:id',
    name: 'folder',
    component: NoteList
  },
  {
    path: '/note/:id',
    name: 'note',
    component: NoteEditor
  },
  {
    path: '/new',
    name: 'new-note',
    component: NoteEditor
  }
]
