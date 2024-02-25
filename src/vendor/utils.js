const getGitProvideFromGitRepoUrl = (gitRepoUrl) => {
  if (gitRepoUrl.includes('github')) {
    return 'github'
  } else if (gitRepoUrl.includes('gitlab')) {
    return 'gitlab'
  } else {
    return null
  }
}

const getGitRepoOwnerFromGitRepoUrl = (gitRepoUrl) => {
  const gitRepoUrlParts = gitRepoUrl.split('/')
  if (gitRepoUrlParts.length < 2) {
    return null
  }
  return gitRepoUrlParts[gitRepoUrlParts.length - 2]
}

const getGitRepoNameFromGitRepoUrl = (gitRepoUrl) => {
  const gitRepoUrlParts = gitRepoUrl.split('/')
  if (gitRepoUrlParts.length < 2) {
    return null
  }
  return gitRepoUrlParts[gitRepoUrlParts.length - 1]
}

const getGraphQlHttpBaseUrl = () => {
  if (import.meta.env.VITE_GRAPHQL_HTTP_BASE_URL) {
    return import.meta.env.VITE_GRAPHQL_HTTP_BASE_URL
  }
  return window.location.origin
}

const getGraphQlWsBaseUrl = () => {
  if (import.meta.env.VITE_GRAPHQL_WS_BASE_URL) {
    return import.meta.env.VITE_GRAPHQL_WS_BASE_URL
  }
  let protocol = 'ws'
  if (window.location.protocol === 'https:') {
    protocol = 'wss'
  }
  return `${protocol}://${window.location.host}`
}

const getHttpBaseUrl = () => {
  if (import.meta.env.VITE_HTTP_BASE_URL) {
    return import.meta.env.VITE_HTTP_BASE_URL
  }
  return window.location.origin
}

const preventSpaceInput = (event) => {
  if (event.keyCode === 32 || event.keyCode === 9 || event.keyCode === 13) {
    event.preventDefault()
  }
}

export {
  getGitProvideFromGitRepoUrl,
  getGitRepoOwnerFromGitRepoUrl,
  getGitRepoNameFromGitRepoUrl,
  getGraphQlHttpBaseUrl,
  getGraphQlWsBaseUrl,
  getHttpBaseUrl,
  preventSpaceInput
}
