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
    // TODO update this to redirect to dashboard
    {
      path: '/',
      redirect: '/test'
    },
  ]
})

export default router
