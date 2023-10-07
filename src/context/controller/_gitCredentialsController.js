import axios from "axios"
import route from "../../config/route"

export default class GitCredentialsController {

  // Fetch git credentials
  async fetchAll() {
    try {
      const res = await axios({
        method: 'get',
        url: route.GIT_CREDENTIALS
      })
      return {
        status: true,
        message: 'Success',
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to fetch git credentials"
      return {
        status: false,
        message: message,
        data: []
      }
    }
  }

  // Add git credentials
  async add(name, username, password) {
    try {
      const res = await axios({
        method: "post",
        url: route.GIT_CREDENTIALS,
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          name: name,
          username: username,
          password: password
        })
      })
      return {
        status: true,
        message: "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to add git credentials"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }

  // Update git credential
  async update(id, name, username, password) {
    try {
      const res = await axios({
        method: "put",
        url: route.GIT_CREDENTIALS + "/" + id,
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          name: name,
          username: username,
          password: password
        })
      })
      return {
        status: true,
        message: "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to update git credentials"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }

  // Delete git credential
  async delete(id) {
    try {
      const res = await axios({
        method: "delete",
        url: route.GIT_CREDENTIALS + "/" + id,
      })
      return {
        status: true,
        message: "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to delete git credentials"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }

  // test git credential
  async testAccess(id, repo_url, branch) {
    try {
      const res = await axios({
        method: "get",
        url: route.GIT_CREDENTIALS + "/" + id + "/test?repository_url=" + repo_url + "&branch="+branch,
      })
      return {
        status: true,
        message: res.data.message || "Success",
        data: {}
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to access git repository"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }
} 