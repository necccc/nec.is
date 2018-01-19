const fs = require('fs');
const { convert } = require('convert-svg-to-png');
const cheerio = require('cheerio')
const readingTime = require('reading-time');
const moment = require('moment');

module.exports = function (log, db) {
    return new Promise(async (resolve, reject) => {
        fs.readFile(process.cwd()+'/themes/nec.is/source/social-card-template.svg', async function (err, data) {
            if (err) return reject(err);

            log.write('Template SVG loaded')

            const svg = cheerio.load(data.toString())
            var Post = db.model('Post')
            Post.each(async (post) => {
                const postDir = `${process.cwd()}/source/${post.source.replace('.md', '')}`

                try {
                    fs.accessSync(postDir, fs.constants.R_OK | fs.constants.W_OK)
                } catch (e) {
                    // create post asset dir if not exists
                    fs.mkdirSync(postDir)
                }

                svg('#TitleText').text(post.title)
                svg('#MetaText').text(`${moment(post.date).format('YYYY MMM D')} ・ ${readingTime(post.content).text.trim()}`)

                const png = await convert(svg.html())

                log.write('Social card generated: ' + post.title)

                fs.writeFile(`${postDir}/social-card.png`, png, (err) => {
                    if (err) return reject(err)

                    resolve(true)
                })
            })
        })
    })
}