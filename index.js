const core = require('@actions/core')
const axios = require('axios')
const { sign: createToken } = require('jsonwebtoken')

const main = async () => {
  const url = core.getInput('url', { required: true })
  const token = core.getInput('token', { required: true })

  let environment = core.getInput('environment')
  let endpoint = core.getInput('endpoint')

  const sha = process.env.GITHUB_SHA
  const repository = process.env.GITHUB_REPOSITORY
  const branch = process.env.GITHUB_REF.replace('refs/heads/', '')
  const [secret, jws] = token.split(':')

  if (!environment || environment.trim().length === 0) {
    environment = branch === 'master' ? 'Production' : 'Preview'
  }

  if (!endpoint) {
    endpoint = 'https://lighthouse-metrics.com/api/integrations/custom/webhook'
  }

  core.debug(`URL: ${url}`)
  core.debug(`Token (length): ${token.length}`)
  core.debug(`SHA: ${sha}`)
  core.debug(`Repository: ${repository}`)
  core.debug(`Branch: ${branch}`)
  core.debug(`Environment: ${environment}`)
  core.debug(`Endpoint: ${endpoint}`)

  await axios.post(`${endpoint}?secret=${secret}`, {
    action: 'requested',
    deployment: {
      sha,
      url,
      environment,
      repository,
      branch
    }
  }, {
    headers: {
      'x-lighthouse-metrics-event': 'suite',
      'x-webhook-signature': createToken({ iss: 'github-action' }, jws)
    }
  })
    .catch(error => {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message)
      }
      throw error
    })
}

main()
  .catch((err) => core.setFailed(err.message))
  .then(() => core.debug(`Finished in ${process.uptime()}s`))
