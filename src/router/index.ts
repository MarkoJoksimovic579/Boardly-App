import { createRouter, createWebHistory } from 'vue-router'

import PublicLayout from '@/layouts/PublicLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LoginComp from '@/features/users/components/LoginComp.vue'
import RegisterComp from '@/features/users/components/RegisterComp.vue'
import BoardsCloseView from '@/views/BoardsCloseView.vue'
import BoardsView from '@/views/BoardsView.vue'
import TaskViewComp from '@/features/tasks/components/TaskViewComp.vue'
import { useSessionStore } from '@/stores/usersSessionStore'
import DashBoardView from '@/views/DashBoardView.vue'
import BoardsFavoritesComp from '@/features/boards/components/BoardsFavoritesComp.vue'
import LabelView from '@/features/admin/LabelView.vue'
import UsersView from '@/features/admin/UsersView.vue'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // PUBLIC
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', component: HomeView },
        { path: 'login', component: LoginComp },
        { path: 'register', component: RegisterComp },
      ],
    },

    // APP (AUTH AREA)
    {
      path: '/app',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: 'boards/:id', component: BoardsCloseView },
        { path: 'dashboard', component: DashBoardView },
        { path: 'profile', component: ProfileView },

        { path: 'boards', component: BoardsView },
        { path: 'favorites', component: BoardsFavoritesComp },
        { path: 'tasks/:id', component: TaskViewComp },
        { path: 'admin/labels', component: LabelView },
        { path: 'admin/users', component: UsersView },
      ],
    },
  ],
})
router.beforeEach((to) => {
  const session = useSessionStore()

  const isLoggedIn = !!session.sid

  // nije ulogovan
  if (to.meta.requiresAuth && !isLoggedIn) {
    return '/login'
  }

  // već ulogovan → ne daj login/register
  if (isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    return '/app/boards'
  }
})

export default router
