import axios from "axios"
import route from "../../config/route"

export default class ApplicationController {

  // fetch service names
  async fetchNames() {
    try {
      const res = await axios({
        method: 'get',
        url: route.SERVICE_NAMES
      })
      return {
        status: true,
        message: 'Success',
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to fetch service names"
      return {
        status: false,
        message: message,
        data: []
      }
    }
  }

  // fetch application details
  async fetchDetails(id) {
    try {
      const res = await axios({
        method: 'get',
        url: route.APPLICATIONS + "/" + id
      })
      return {
        status: true,
        message: 'Success',
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to fetch service names"
      return {
        status: false,
        message: message,
        data: []
      }
    }
  }

  // fetch applications summary
  async fetchApplicationsSummary() {
    try {
      const res = await axios({
        method: 'get',
        url: route.APPLICATIONS_SUMMARY
      })
      return {
        status: true,
        message: 'Success',
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to fetch applications summary"
      return {
        status: false,
        message: message,
        data: []
      }
    }
  }

  // check service name availability
  async checkServiceNameAvailability(name) {
    try {
      const res = await axios({
        method: 'get',
        url: route.APPLICATION_SERVICE_NAME_AVAILABILITY + "?name=" + name
      })
      return {
        status: true,
        available : res.data.available || false,
      }
    } catch (error) {
      return {
        status: false,
        available : false,
      }
    }
  }
}