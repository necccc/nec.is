/* global hexo */
'use strict'

hexo.extend.helper.register("instagram_link", function ({ text = 'instagram', handle = false } = {}) {
    const baseUrl = 'https://www.instagram.com/'
    const instagramHandle = handle || this.config.instagram
    const linktext = text || handle || 'twitter'

    return `<a href="${baseUrl + instagramHandle}">${linktext}</a>`
})