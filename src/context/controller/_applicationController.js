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
    const pattern = /^(https:\/\/(?:github\.com|gitlab\.com|bitbucket\.org)\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)\/tree\/(?:main|master)$/;
    const new_repo_url = repository_url.replace(pattern, '$1');
    console.log(new_repo_url);

    try {
      const res = await axios({
        method: "post",
        url: route.DOCKER_CONFIG_GENERATE_GIT,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: qs.stringify({
          'repository_url': new_repo_url,
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

  // from dockerfile custom
  async generateDockerConfigFromCustomDockerfile(docker_file) {
    try {
      const res = await axios({
        method: "post",
        url: route.DOCKER_CONFIG_GENERATE_CUSTOM,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: qs.stringify({
          'dockerfile': docker_file
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

  // redeploy application
  async redeploy(id) {
    try {
      const res = await axios({
        method: "post",
        url: route.APPLICATIONS + "/" + id + "/redeploy",
        headers: {
          "Content-Type": "application/json"
        }
      })
      return {
        status: true,
        message: res.data.message || "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to redeploy application"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }

  // delete application
  async delete(id) {
    try {
      const res = await axios({
        method: "delete",
        url: route.APPLICATIONS + "/" + id,
        headers: {
          "Content-Type": "application/json"
        }
      })
      return {
        status: true,
        message: res.data.message || "Success",
        data: res.data
      }
    } catch (error) {
      let message = error.response.data.message || "Failed to delete application"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }

  // fetch application logs
  async fetchBuildLogs(id) {
    try {
      const res = await axios({
        method: 'get',
        url: route.APPLICATIONS + "/" + id + "/logs/build"
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

  // fetch application log
  async fetchBuildLog(application_id, log_id) {
    try {
      const res = await axios({
        method: 'get',
        url: route.APPLICATIONS + "/" + application_id + "/logs/build/" + log_id
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

  // fetch runtime log
  async fetchRuntimeLog(application_id) {
    try {
      const res = await axios({
        method: 'get',
        url: route.APPLICATIONS + "/" + application_id + "/logs/runtime"
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

  // update application
  async update(id, config) {
    try {
      const res = await axios({
        method: "put",
        url: route.APPLICATIONS + "/" + id,
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
      let message = error.response.data.message || "Failed to update application"
      return {
        status: false,
        message: message,
        data: {}
      }
    }
  }
}