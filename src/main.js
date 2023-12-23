import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/store/auth.js'

import App from './App.vue'
import router from './router'
import "./assets/css/base.css"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  if (!authStore.IsLoggedIn && to.name !== 'Login') {
    return { name: 'Login' }
  }
  if(authStore.IsLoggedIn && to.name === 'Login') {
    return { name: '' }
  }
})
