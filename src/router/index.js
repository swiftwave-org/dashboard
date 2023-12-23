import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/pages/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/',
      redirect: '/test'
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/pages/TestView.vue')
    }
  ]
})

export default router
