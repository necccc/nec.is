
const ig = require('instagram-node').instagram();
const rp = require('request-promise-native');

const getIgMedia = (mediaId) => {
    return new Promise((resolve, reject) => {
        ig.media(mediaId, (err, media, remaining, limit) => {
            if (err) return reject(err);

            resolve(media);
        });
    })
}

const getInfo = (slug) => {
    return rp(
        `https://api.instagram.com/oembed/?url=http://instagram.com/p/${slug}`,
        {
            json: true
        })
}

ig.use({
    access_token: '217217182.1677ed0.7cad815cb833450a9511ec055838a970'
});

Promise.all([
    getInfo('Ba-ULrYBiWo'),
    getInfo('BbE3X8oBw4Z'),
    getInfo('BbGKOachkA3')
]).then((result) => {
    return result.map((res) => res.media_id)
}).then((mediaIds) => {
    return Promise.all(mediaIds.map((mediaId) => getIgMedia(mediaId)))
}).then((medias) => {
    let result = medias.map((media) => {
        if (media.type === 'carousel') {
            return media.carousel_media.map((d) => {
                return d.images.standard_resolution.url;
            })
        } else {
            return [media.images.standard_resolution.url];
        }
    })

    result = result.reduce((collect, arr) => collect.concat(arr), [])

    console.log(result)
})
.catch((err) => {
    console.log(err)
});