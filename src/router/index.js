import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/pages/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    // TODO update this to redirect to dashboard
    {
      path: '/',
      redirect: '/git-credentials'
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/views/pages/UsersManagement.vue')
    },
    {
      path: '/git-credentials',
      name: 'Git Credentials',
      component: () => import('@/views/pages/GitCredentialManagement.vue')
    },
    {
      path: '/image-registry-credentials',
      name: 'Image Registry Credentials',
      component: () => import('@/views/pages/ImageRegistryCredentialManagement.vue')
    },
    {
      path: '/domains',
      name: 'Domains',
      component: () => import('@/views/pages/DomainManagement.vue')
    }
  ]
})

export default router
