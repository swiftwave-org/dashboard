import axios from "axios"
import route from "../../config/route"

export default class IngressRulesController{
  // Fetch ingress rules
  async fetchAll(){
    try {
      const res = await axios({
        method: 'get',
        url: route.INGRESS_RULES
      })
      return {
        status: true,
        message: 'Success',
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to fetch ingress rules"
      return {
        status: false,
        message: message,
        data: []
      } 
    }
  }
  
  // Add ingress rule
  async add(protocol, domain_name, port, service_name, service_port){
    let ingress_port = "";
    if(protocol == "https"){
      ingress_port = "443";
    } 
    else {
      ingress_port = port;
    }
    if(ingress_port  == ""){
      return {
        status: false,
        message: "Port cannot be empty",
        data: {}
      }
    }
    if(service_port == ""){
      return {
        status: false,
        message: "Service Port cannot be empty",
        data: {}
      }
    }
    try {
      const res = await axios({
        method: "post",
        url: route.INGRESS_RULES,
        headers: { 
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          protocol: protocol,
          port: parseInt(ingress_port),
          domain_name: domain_name,
          service_name: service_name,
          service_port: parseInt(service_port)
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
        url: route.INGRESS_RULES+"/"+id,
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

  // Fetch restricted ports
  async fetchRestrictedPorts(){
    try {
      const res = await axios({
        method: 'get',
        url: route.RESTRICTED_PORTS
      })
      return {
        status: true,
        message: 'Success',
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to fetch restricted ports"
      return {
        status: false,
        message: message,
        data: []
      } 
    }
  }
}