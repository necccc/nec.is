/* global hexo */
'use strict';

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

hexo.extend.tag.register("instagram_gallery", function (instaIds) {

    //let instaIds = args[0];

//console.log(args)

    return Promise.all(instaIds.map((id) => getInfo(id)))
        .then((result) => {
            return result.map((res) => res.media_id)
        })
        .then((mediaIds) => {
            return Promise.all(mediaIds.map((mediaId) => getIgMedia(mediaId)))
        })
        .then((medias) => {
            return medias.map((media) => {
                let link = media.link;

                console.log(media)
                if (media.type === 'carousel') {
                    let images = media.carousel_media.map((d) => {
                        return d.images.standard_resolution.url;
                    });
                    return {
                        link,
                        images
                    }
                } else {
                    let images = [media.images.standard_resolution.url];
                    return {
                        link,
                        images
                    };
                }
            })
        })
        .then((medias) => {
            return medias.map((media) => {
                const { link, images } = media;

                console.log(link, images)
                return images.map((image) => {
                    return `<a href="${link}" rel="noopener"><img src="${image}" width="150"></a>`
                }).join('');
            }).join('')
        })
        .catch((err) => {
            console.log(err)
        });
}, {async: true})