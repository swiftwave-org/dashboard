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

export { getGitProvideFromGitRepoUrl, getGitRepoOwnerFromGitRepoUrl, getGitRepoNameFromGitRepoUrl }
