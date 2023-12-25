import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'
import { DefaultApolloClient } from '@vue/apollo-composable'

import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBox,
  faCloud,
  faCodeBranch,
  faHammer,
  faHardDrive,
  faLink,
  faLocationArrow,
  faNetworkWired,
  faRightFromBracket,
  faUsers
} from '@fortawesome/free-solid-svg-icons'

import { useAuthStore } from '@/store/auth.js'
import Toast from 'vue-toastification'

import App from './App.vue'
import router from './router'
import './assets/css/base.css'
import 'vue-toastification/dist/index.css'

// add icons to library
library.add(
  faHammer,
  faBox,
  faHardDrive,
  faCodeBranch,
  faCloud,
  faLink,
  faNetworkWired,
  faLocationArrow,
  faUsers,
  faRightFromBracket
)

// Setup apollo client
// create apollo link
const apolloLink = createHttpLink({
  uri: 'https://ip-13-232-106-63.swiftwave.xyz:3333/graphql'
})

// create auth middleware
const apolloAuthMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const authStore = useAuthStore()
  operation.setContext({
    headers: {
      authorization: authStore.FetchBearerToken()
    }
  })
  return forward(operation)
})

// create apollo client
const apolloClient = new ApolloClient({
  link: apolloAuthMiddleware.concat(apolloLink),
  cache: new InMemoryCache()
})

// create app
const app = createApp({
  setup() {
    // provide apollo client
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App)
})
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
})
app.mount('#app')

// Protect routes
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  if (!authStore.IsLoggedIn && to.name !== 'Login') {
    return { name: 'Login' }
  }
  if (authStore.IsLoggedIn && to.name === 'Login') {
    return { name: '' }
  }
})
