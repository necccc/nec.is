/* global hexo */
'use strict';

hexo.extend.helper.register("github_link", function ({ text = 'github', handle = false } = {}) {
    const baseUrl = 'https://github.com/';
    const githubHandle = handle || this.config.github;
    const linktext = text || handle || 'github';

    return `<a href="${baseUrl + githubHandle}">${linktext}</a>`;
})