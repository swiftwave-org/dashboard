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
      path: '',
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
      component: () => import('@/views/pages/ApplicationDetails.vue'),
      children: [
        {
          path: 'deployments',
          name: 'Application Details Deployments',
          component: () => import('@/views/pages/ApplicationDetails/DeploymentList.vue')
        },
        {
          path: 'runtime_logs',
          name: 'Application Details Runtime Logs',
          component: () => import('@/views/pages/ApplicationDetails/RuntimeLogs.vue')
        },
        {
          path: 'ingress_rules',
          name: 'Application Details Ingress Rules',
          component: () => import('@/views/pages/ApplicationDetails/IngressRules.vue')
        },
        {
          path: 'update_source',
          name: 'Application Details Update Source',
          component: () => import('@/views/pages/ApplicationDetails/UpdateSourceCode.vue')
        },
        {
          path: 'environment_variables',
          name: 'Application Details Environment Variables',
          component: () => import('@/views/pages/ApplicationDetails/EnvironmentVariables.vue')
        },
        {
          path: 'persistent_volumes',
          name: 'Application Details Persistent Volumes',
          component: () => import('@/views/pages/ApplicationDetails/PersistentVolumes.vue')
        },
        {
          path: 'deployment_config',
          name: 'Application Details Deployment Config',
          component: () => import('@/views/pages/ApplicationDetails/DeploymentConfig.vue')
        },
        {
          path: 'danger_zone',
          name: 'Application Details Danger Zone',
          component: () => import('@/views/pages/ApplicationDetails/DangerZone.vue')
        },
        {
          path: 'webhook_ci',
          name: 'Application Details Webhook CI',
          component: () => import('@/views/pages/ApplicationDetails/WebhookCI.vue')
        }
      ]
    },
    {
      path: '/deployment/:id',
      name: 'Deployment Details',
      component: () => import('@/views/pages/DeploymentDetails.vue')
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
    },
    {
      path: '/pv-backup-download/:backup_id',
      name: 'Download Persistent Volume Backup',
      component: () => import('@/views/pages/DownloadPVBackup.vue')
    }
  ]
})

export default router
