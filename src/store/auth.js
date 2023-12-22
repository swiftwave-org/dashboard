import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('counter', () => {
  const IsLoggedIn = ref(false)
  const AccessToken = ref('')

  async function Login(username, password) {
    // login
    let data = new FormData()
    data.append('username', username)
    data.append('password', password)

    let config = {
      method: 'post',
      url: 'https://ip-13-232-106-63.swiftwave.xyz:3333/auth/login',
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
    // redirect to /
    window.location.href = '/'
  }

  function SetCredential(token) {
    IsLoggedIn.value = true
    AccessToken.value = token
    localStorage.setItem('token', token)
  }

  return { IsLoggedIn, Login, Logout, SetCredential }
})