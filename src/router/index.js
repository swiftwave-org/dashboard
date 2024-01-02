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
    {
      path: '/',
      redirect: '/applications'
    },
    {
      path: '/deploy-application',
      name: 'Deploy Application',
      component: () => import('@/views/pages/DeployApplication.vue')
    },
    {
      path: '/applications',
      name: 'Applications',
      component: () => import('@/views/pages/ApplicationManagement.vue')
    },
    {
      path: '/application/:id',
      name: 'Application Details',
      component: () => import('@/views/pages/ApplicationDetails.vue')
    },
    {
      path: '/persistent-volumes',
      name: 'Persistent Volumes',
      component: () => import('@/views/pages/PersistentVolumeManagement.vue')
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
    },
    {
      path: '/redirect-rules',
      name: 'Redirect Rules',
      component: () => import('@/views/pages/RedirectRuleManagement.vue')
    },
    {
      path: '/ingress-rules',
      name: 'Ingress Rules',
      component: () => import('@/views/pages/IngressRuleManagement.vue')
    }
  ]
})

export default router
