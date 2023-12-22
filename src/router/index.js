import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/pages/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

export default router
