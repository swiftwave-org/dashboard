import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHammer, faBox, faHardDrive, faCodeBranch, faCloud, faLink, faNetworkWired, faLocationArrow, faUsers, faRightFromBracket} from '@fortawesome/free-solid-svg-icons'


import { useAuthStore } from '@/store/auth.js'

import App from './App.vue'
import router from './router'
import "./assets/css/base.css"

// add icons to library
library.add(faHammer, faBox, faHardDrive, faCodeBranch, faCloud, faLink, faNetworkWired, faLocationArrow, faUsers, faRightFromBracket)

// create app
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
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
