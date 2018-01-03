/* global hexo */
'use strict';

hexo.extend.helper.register("github_link", function (handle, linktext) {
    const baseUrl = 'https://github.com/'
    const githubHandle = handle || this.config.github
    const text = linktext || handle || 'github';

    return `<a href="${baseUrl + githubHandle}">${text}</a>`;
})