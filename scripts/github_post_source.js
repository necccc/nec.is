/* global hexo */
'use strict';

hexo.extend.helper.register("github_post_source", function (linktext) {
    const baseUrl = this.config.github_source
    const text = linktext || 'post source on github'

    if (!this.post || !this.post.source) {
        return '';
    }

    return `<a href="${baseUrl + this.post.source}">${text}</a>`;
})