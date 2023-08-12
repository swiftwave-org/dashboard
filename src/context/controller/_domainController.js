import axios from "axios"
import route from "../../config/route"

export default class DomainController {

  // Fetch domains
  async fetchAll() {
    try {
      const res = await axios({
        method: 'get',
        url: route.DOMAINS
      })
      return {
        status: true,
        message: 'Success',
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to fetch domains"
      return {
        status: false,
        message: message,
        data: []
      }
    }
  }

  // Add domain
  async add(domain_name) {
    try {
      const res = await axios({
        method: "post",
        url: route.DOMAINS,
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          name: domain_name
        })
      })
      return {
        status: true,
        message: "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to add domain"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }

  // Issue SSL
  async issueSSL(id) {
    try {
      const res = await axios({
        method: "post",
        url: route.DOMAINS + "/" + id + "/ssl/issue",
        headers: {
          "Content-Type": "application/json"
        },
      })
      return {
        status: true,
        message: "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to place SSL request"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }

  // Delete domain
  async delete(id) {
    try {
      const res = await axios({
        method: "delete",
        url: route.DOMAINS + "/" + id,
      })
      return {
        status: true,
        message: "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to delete domain"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }

  // Fetch domain names
  async fetchNames() {
    try {
      const res = await axios({
        method: 'get',
        url: route.DOMAIN_NAMES
      })
      return {
        status: true,
        message: 'Success',
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to fetch domain names"
      return {
        status: false,
        message: message,
        data: []
      }
    }
  }
} 