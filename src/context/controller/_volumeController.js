import axios from "axios"
import route from "../../config/route"
import qs from "qs"

export default class VolumeController {

  // Fetch all volumes
  async fetchAll() {
    try {
      const res = await axios({
        method: 'get',
        url: route.VOLUMES
      })
      return {
        status: true,
        message: 'Success',
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to fetch persistent volumes"
      return {
        status: false,
        message: message,
        data: []
      }
    }
  }

  // Add volume
  async add(name) {
    try {
      const res = await axios({
        method: "post",
        url: route.VOLUMES,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: qs.stringify({
          name: name,
        })
      })
      return {
        status: true,
        message: "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to add volume"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }

  // Delete volume
  async delete(name) {
    try {
      const res = await axios({
        method: "delete",
        url: route.VOLUMES + "/" + name,
      })
      return {
        status: true,
        message: "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to delete volume"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }
} 