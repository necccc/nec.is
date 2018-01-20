const rp = require('request-promise-native');
const cheerio = require('cheerio')

const checkLinks = async function (links) {
    const linkChecks = links.map(link => {
        return rp(link, { resolveWithFullResponse: true })
            .then(r => r.statusCode)
            .catch((e) => e.statusCode)
    })

    return Promise.all(linkChecks)
}

const checkPost = async function (links) {
    const urls = links.map(data => data.url)
    let result;

    try {
        result = await checkLinks(urls)
    } catch(e) {
        throw e;
    }

    const deadLinks = result.reduce((data, statusCode, index) => {
        if (statusCode >= 400) {
            data.push([statusCode, links[index]])
        }
        return data;
    }, [])

    return deadLinks
}

module.exports = async function (log, db) {

    var Post = db.model('Post');

    return new Promise(async (resolve, reject) => {

        Post.each(async (post) => {
            const $post = cheerio.load(post.content)

            const links = $post('a').toArray().map((elem) => {
                return {
                    source: post.source,
                    post: post.title,
                    url: elem.attribs.href
                }
            })

            let result = await checkPost(links)

            for (let data of result) {
                let { source, post, url } = data[1];
                log.write(`\t${data[0]}\t${url}\t${source}`)
            }

            resolve(true)
        })
    })

}