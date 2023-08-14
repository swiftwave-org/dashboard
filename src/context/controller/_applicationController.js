import axios from "axios"
import route from "../../config/route"
import qs from "qs";

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
        available: res.data.available || false,
      }
    } catch (error) {
      return {
        status: false,
        available: false,
      }
    }
  }


  // Generate docker config
  // from git
  async generateDockerConfigFromGit(git_credential_id, repository_url, branch) {
    try {
      const res = await axios({
        method: "post",
        url: route.DOCKER_CONFIG_GENERATE_GIT,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: qs.stringify({
          'repository_url': repository_url,
          'branch': branch,
          'git_credential_id': git_credential_id
        })
      })
      return {
        status: true,
        message: "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to generate docker config"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }

  // from tar
  async generateDockerConfigFromTarball(tarball_file) {
    try {
      const res = await axios({
        method: "post",
        url: route.DOCKER_CONFIG_GENERATE_CODE,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: qs.stringify({
          'file': tarball_file
        })
      })
      return {
        status: true,
        message: "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to generate docker config"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }

  // Upload tar file
  async uploadTarFile(fileblob) {
    try {
      var data = new FormData();
      data.append('file', fileblob, 'file.tar');

      console.log(data.getAll('file'))
      const res = await axios({
        method: "post",
        url: route.UPLOAD_TAR,
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: data
      })
      return {
        status: true,
        message: res.data.message || "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to upload tar file"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }

  // deploy application
  async deployApplication(config) {
    try {
      const res = await axios({
        method: "post",
        url: route.DEPLOY_APPLICATION,
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify(config)
      })
      return {
        status: true,
        message: res.data.message || "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to deploy application"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }
}