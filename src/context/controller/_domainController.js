import axios from "axios"
import route from "../../config/route"

export default class DomainController{

  // Fetch domain names
  async fetchNames(){
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