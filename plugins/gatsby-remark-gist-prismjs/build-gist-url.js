const querystring = require("querystring");

const GITHUB_API_URL = 'https://api.github.com'

module.exports = function buildGistUrl (gist, options) {
  const { accessToken } = options

  const params = querystring.stringify({
    'access_token': accessToken
  })

  return `${GITHUB_API_URL}/gists/${gist.id}?${params}`
}
