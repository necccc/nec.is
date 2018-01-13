const alex = require('alex');

module.exports = function (log, db) {

    return new Promise((resolve, reject) => {

        var Post = db.model('Post');
        Post.each(async (post) => {

            log.write('Alex checked: ' + post.title)

            const title = alex(post.title);
            const content = alex.markdown(post.raw).messages;

            for(let line of content) {
                //if(line.fatal || line.profanitySeverity > 0) {
                    log.write('\t' + line.toString())
                //}
            }
            resolve(true)
        })
    })
}
