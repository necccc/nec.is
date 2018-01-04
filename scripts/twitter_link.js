/* global hexo */
'use strict';

hexo.extend.helper.register("twitter_link", function ({ text = 'twitter', handle = false } = {}) {
    const baseUrl = 'https://twitter.com/';
    const twitterHandle = handle || this.config.twitter;
    const linktext = text || handle || 'twitter';

    return `<a href="${baseUrl + twitterHandle}">${linktext}</a>`;
})