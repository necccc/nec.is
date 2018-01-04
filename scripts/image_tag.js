hexo.extend.tag.register('image_tag', function(args, content){
    const [
        type,
        path,
        alt,
        title,
        source
    ] = args;

    let description = '';
    if (title) {
        description = `<small class="image-description">${title}</small>`;
    }

    return `<div class="image ${type}">
        <img src="${path}" class="${type}" alt="${alt}">
        ${description}
    </div>`
});