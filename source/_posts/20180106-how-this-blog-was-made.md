---
title: How this site was made
description: "I’ve collected some useful info about how this blog is running, summarised in 3 topics: static site generator, deployment and some small nice details"
unlisted: true
categories:
- writing
tags:
- learning
- hexo
- netlify
- tutorial
---

I’ve collected some useful info about how this blog is running, summarised in 3 topics:

* Static site generator
* Deployment
* Small nice things


## Static sites

I’ve used a few number of static site generators before, for various projects. For example, the earlier versions of [jsconfbp.com](jsconfbp.com) used Docpad and Jekyll. These were great for a start, but I soon realized a few things that bothered me. Docpad had some compatibility with node versions, and Jekyll was based on Ruby. The language is not a problem, but I moved away from it for two reasons:

* I would like to keep my site on the node platform I like and use daily basis
* I plan to move away from GitHub pages, where Jekyll is really handy - but do not wish to hassle with the setup elsewhere

### Hexo

{% image_tag "pull-right" "hexo-logo.png" "The Hexo project logo" %}

After looking around a bit, I found [Hexo](https://hexo.io/), a Node/JavaScript based static site generator. It just that has all the tools I need:

* content tags
* content metadata
* partials
* helper functions
* data filtering
* static site generation
* asset build pipeline

You can use Front Matter with your content, define variables and metadata next to your markdown-based content - just like in Jekyll.
Define your own content tags, that can be used in the markdown content source, along with several other, pre-defined ones, like code blocks or gist embeds.

Using included partials, I could create reusable components for the site, that can be fed with the necessary data. Besides a handful of helper functions, you can write your own helpers. They access all the relevant data needed, either from the content, or the configuration. The documentation of Hexo, however, is not the best, took a while to figure out where to put these plugins.

Here are some examples for helpers and tags, just put them in your `scripts` folder in your Hexo site:

{% code javascript %}

    // an example for a helper function
    hexo.extend.helper.register("reading_time", function (post) {
        if (!post.content) return '';
        return readingTime(post.content).text;
    })

    // example for a content tag
    hexo.extend.tag.register('code', function(args, content){    
        const [ lang ] = args;
        return `<div class="code-block ${lang}">
            ${content}
        </div>`;
    }, { ends: true });
{% endcode %}

The important difference between helpers and tags:
* tags are only usable in the content source, like markdown documents of posts, and
* helpers are to be used in templates, partials, and layouts.

Hexo uses a JSON based data store called [Warehouse](https://github.com/hexojs/warehouse), which has a MongoDB-ish API syntax. All the posts, categories, tags and content-relevant meta can be queried, ordered and filtered through this API.

During development, you can create a Hexo server from the CLI. This will re-render your site and content on every page request, so development is relatively easy. The only useless I had to restart this small server, are the following:
* updated the configs
* updated any plugin, like a tag or a helper

Using plugins like `hexo-renderer-scss` enables your site to use SASS and sass files, functions and mixins - with zero configuration.

If you’re interested, check the source of this site on GitHub.

## Deployment

{% image_tag "pull-right" "netlify-logo.png" "The Netlify logo" %}

I’ve mentioned, that I wish to move away from GitHub pages, and luckily [Sara Soueidan]() migrated her site too recently. She picked Netlify as a static site host - so following her footsteps, I took a glance at it.

[Netlify](https://www.netlify.com/) is a nice platform that summarises a CI tool, a hosting service, a CDN provider and a DNS provider. It is especially easy to use with static sites:

* you connect it to your GitHub repo
* configure your environment
* define your branches that can be deployed
* set the build command
* push code
* and you’re done!

Your site appears under a random netlify URL, where you can preview it and you can review your deployment logs on their dashboard. After adding your custom domain, they can set up free https using [LetsEncrypt](https://letsencrypt.org/) - and all this free for personal projects. They’re really easy to use, definitely worth checking out!

## All the nice, small things

After the basics were settled, some ideas popped into my mind to make this blog maybe a bit better.

### Instagram gallery

I wished to share some sights from the places I’ve been and talked, and I usually post these photos on Instagram. Unfortunately, the Instagram API documentation wasn’t too friendly on how to access their API, especially when it came to authentication. But this [small tool by the Pixel Union](http://instagram.pixelunion.net/) is an easy way to get an access token, that can be used during deployment and site generation, to fetch the images for the gallery. Under the hood, you authorize their web app, to access your photos, and they give you the access token they would use.

Another thing is the `media_id` for the Instagram images, which is needed in the API if you wish to query your images - but getting this ID is not that obvious. Luckily Instagram supports [oEmbed](https://oembed.com/) which is a JSON API for generating embed codes for content on the internet. This API does not provide the full amount of data I wanted to access, but using the oEmbed API of Instagram, it is possible to fetch the exact `media_id` that is needed, [like this](https://api.instagram.com/oembed/?url=http://instagram.com/p/BaL_uqIBz3Q/)

So I’ve hacked a Hexo content tag together, which does the following:

1. receives a few Instagram URL slugs form the net, of the posts I wish to use in the gallery
2. Using the oEmbed API fetches the necessary media_id-s
3. using these IDs, it queries the Instagram API for the media data
4. extracts the images for the post even if it’s a carousel (the one where you can put many images in one post)
5. generates HTML code with the images and the links to the Instagram posts

Do not forget that this happens at site generation, not site visit, so it’s pretty neat.

### Estimated post read time

I love this feature on Medium and found a [node lib called 'reading-time'](https://www.npmjs.com/package/reading-time) that calculates exactly this data - or at least a near estimate. Pass it the content of a post and it will return the time it calculated, all at site generation time during deployment.

### Comments

To be honest, I do not wish to hassle with comments on this site. All the content source is available on GitHub, where one can fork and suggest an edit, or just find me and ask questions.

It was easy to create the exact GitHub URL for each post, using their source filenames, like [the one for this post](https://github.com/necccc/nec.is/blob/master/source/_posts/20180106-how-this-blog-was-made.md) and add them automatically to the bottom of each post.

## That’s all folks

I hope some of this may help you make your own site better, in any aspect - if so, I was glad to help :)