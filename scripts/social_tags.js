/* global hexo */
'use strict';

hexo.extend.helper.register("social_tags", function () {

    const image = ''
    let asset_dir = '/'
    let title = ''
    let description = ''
    let url = this.config.url

    if (this.post) {
        asset_dir = this.post.asset_dir || '/'
        title = this.post.title
        description = this.post.summary
        url += this.post.path
    } else if (this.page) {
        asset_dir = this.page.asset_dir || '/'
        title = this.page.title
        description = this.page.summary
        url += this.page.path
    }

    const twitter_user = '@' + this.config.twitter;

    return `
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="${twitter_user}">
        <meta name="twitter:creator" content="${twitter_user}">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${url}social-card.png">
        <meta name="twitter:url" content="${url}">

        <meta property="og:type" content="website" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${url}social-card.png" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="300" />
        <meta property="og:site_name" content="${twitter_user}" />
        <meta property="og:url" content="${url}" />
    `;
}, {})