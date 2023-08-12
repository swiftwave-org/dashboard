import axios from "axios"
import route from "../../config/route"

export default class RedirectRulesController{
  // Fetch ingress rules
  async fetchAll(){
    try {
      const res = await axios({
        method: 'get',
        url: route.REDIRECT_RULES
      })
      return {
        status: true,
        message: 'Success',
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to add redirect rules"
      return {
        status: false,
        message: message,
        data: []
      } 
    }
  }
  
  // Add ingress rule
  async add(port, domain_name, redirect_url){
    try {
      const res = await axios({
        method: "post",
        url: route.REDIRECT_RULES,
        headers: { 
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          port: port == "" ? 0 : parseInt(port),
          domain_name: domain_name,
          redirect_url: redirect_url
        })
      })
      return {
        status: true,
        message: "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to add redirect rules"
      return {
        status: false,
        message: message,
        data: {}
      } 
    }
  }
  // Delete ingress rule
  async delete(id){
    try {
      const res = await axios({
        method: "delete",
        url: route.REDIRECT_RULES+"/"+id,
      })
      return {
        status: true,
        message: "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to add redirect rules"
      return {
        status: false,
        message: message,
        data: {}
      } 
    }
  }
}