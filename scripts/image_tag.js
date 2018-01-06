const isAbsoluteUrl = require('is-absolute-url');

hexo.extend.tag.register('image_tag', function(args, content){
    const [
        type,
        path,
        alt,
        title,
        source
    ] = args;

    let url = path;

    if (!isAbsoluteUrl(path)) {
        url = this.path + path;
    }

    let description = '';
    let text = title || alt;

    description = `<small class="image-description">${text}</small>`;

    return `<div class="image ${type}">
        <img src="${url}" class="${type}" alt="${alt}">
        ${description}
    </div>`
});