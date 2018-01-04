/* global hexo */
'use strict';

const readingTime = require('reading-time');

hexo.extend.helper.register("reading_time", function (post) {

    if (!post.content) return '';

    return readingTime(post.content).text;
})