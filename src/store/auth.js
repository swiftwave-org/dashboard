import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { getHttpBaseUrl } from '@/vendor/utils.js'

export const useAuthStore = defineStore('auth_details', () => {
  const IsLoggedIn = ref(false)
  const AccessToken = ref('')
  const IsLoggingInProgress = ref(false)

  function FetchBearerToken() {
    if (IsLoggedIn.value) {
      return 'Bearer ' + AccessToken.value
    }
    return ''
  }

  function SetCredential(token) {
    AccessToken.value = token
    localStorage.setItem('token', token)
    IsLoggedIn.value = true
    IsLoggingInProgress.value = true
    setTimeout(()=>{
      IsLoggingInProgress.value = false
    }, 1500)
  }

  async function Login(username, password) {
    // login
    let data = new FormData()
    data.append('username', username)
    data.append('password', password)

    // environment variable
    const HTTP_BASE_URL = getHttpBaseUrl()

    let config = {
      method: 'post',
      url: `${HTTP_BASE_URL}/auth/login`,
      data: data
    }

    try {
      const res = await axios.request(config)
      const resData = res.data
      SetCredential(resData.token)
      return {
        success: true,
        message: 'Logged in successfully !'
      }
    } catch (e) {
      if (e.response) {
        return {
          success: false,
          message: e.response.data.message || 'Unexpected error'
        }
      } else {
        return {
          success: false,
          message: 'Failed to send request'
        }
      }
    }
  }

  function Logout() {
    // logout
    IsLoggedIn.value = false
    localStorage.clear()
    IsLoggingInProgress.value = true
    // redirect to /
    setTimeout(()=>{
      this.$router.
        push({ name: 'Login' })
        .then(()=>{
          this.$router.go(0)
        })
    }, 500)
  }

  async function CheckAuthStatus() {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const HTTP_BASE_URL = getHttpBaseUrl()
        let config = {
          method: 'get',
          url: `${HTTP_BASE_URL}/verify-auth`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
        const res = await axios.request(config)
        return res.status === 200;

      }
    } catch (e) {
      return false
    }
  }

  async function logoutOnInvalidToken(callback){
    if(!IsLoggedIn.value){
      return
    }
    const isTokenValid = await CheckAuthStatus()
    if(!isTokenValid){
      callback()
    }
  }

  function StartAuthChecker(callback) {
    setInterval(()=>logoutOnInvalidToken(callback), 5000)
  }

  return { IsLoggedIn, IsLoggingInProgress, FetchBearerToken, Login, Logout, SetCredential, StartAuthChecker }
})
