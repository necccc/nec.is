const request = require("request-promise");
const buildGistUrl = require("./build-gist-url")

module.exports = async function fetchGist (gist, options, cache) {
  const cached = await cache.get(gist.id)

  if (cached) {
    return JSON.parse(cached);
  }

  const uri = buildGistUrl(gist, options)
  const body = await request({
    uri,
    headers: {
      'User-Agent': 'Gatsby-Remark-Gist-Prismjs'
    },
  });
  const content = JSON.parse(body);

  await cache.set(gist.id, body)

  return content
}
