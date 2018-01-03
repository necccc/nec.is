/* global hexo */
'use strict';

hexo.extend.helper.register("twitter_link", function (handle, linktext) {
    const baseUrl = 'https://twitter.com/'
    const twitterHandle = handle || this.config.twitter
    const text = linktext || handle || 'twitter';

    return `<a href="${baseUrl + twitterHandle}">${text}</a>`;
})