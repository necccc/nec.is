/* global hexo */
'use strict';

hexo.extend.helper.register("social_tags", function () {

    let asset_dir = '/'
    let title = 'nec.is'
    let description = this.config.subtitle
    let url = this.config.url
    let path = ''
    let image = ''

    const layout = this.post ? this.post.layout : this.page.layout;


    if (this.post) {
        asset_dir = this.post.asset_dir || '/'
        title = this.post.title || title
        description = this.post.summary || description
        path = this.post.path
    } else if (this.page) {
        asset_dir = this.page.asset_dir || '/'
        title = this.page.title || title
        description = this.page.summary || description
        path = this.page.path
    }

    if (path.indexOf('index.html') > -1) {
        path = '/' + path.replace('index.html', '')
    }

    url += path

    if (layout === 'post' || layout === 'speaking-page') {
        image = url + 'social-card.png';
    } else {
        image = '/social-card.png';
    }




    const twitter_user = '@' + this.config.twitter;

    return `
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="${twitter_user}">
        <meta name="twitter:creator" content="${twitter_user}">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${image}">
        <meta name="twitter:url" content="${url}">

        <meta property="og:type" content="website" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="300" />
        <meta property="og:site_name" content="${twitter_user}" />
        <meta property="og:url" content="${url}" />
    `;
}, {})