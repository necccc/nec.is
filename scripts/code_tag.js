hexo.extend.tag.register('code', function(args, content){
    
    const [ lang ] = args;

    return `<pre><code class="${lang}">
        ${content}
    </code></pre>`
}, { ends: true });