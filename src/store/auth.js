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
      window.location.href = '/login'
    }, 500)
  }

  return { IsLoggedIn, IsLoggingInProgress, FetchBearerToken, Login, Logout, SetCredential }
})
