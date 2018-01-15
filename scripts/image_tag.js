const isAbsoluteUrl = require('is-absolute-url');

hexo.extend.tag.register('image_tag', function(args, content){
    const [
        type,
        path,
        alt,
        source
    ] = args;

    let url = path;

    if (!isAbsoluteUrl(path)) {
        url = this.path + path;
    }

    let description = '';
    let sourceText = '';

    if (source) {
        sourceText = ` <br /><a href="${source}">Image source</a>`
    }

    description = `<small class="image-description">${alt}${sourceText}</small>`;

    return `<div class="image ${type}">
        <img src="${url}" class="${type}" alt="${alt}">
        ${description}
    </div>`
});