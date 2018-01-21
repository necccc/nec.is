---
title: This month I've learned - December
description: "Helm for Kubernetes, Ligatures, CSS variables and back to the basics with Trigonometry in December."
categories:
- writing
tags:
- learning
- helm
- kubernetes
- css
- ligature
---

## Helm for kubernetes

{% image_tag "pull-left" "helm-logo.svg" "The Helm logo" %}

We use kubernetes clusters to deploy and run services, but until now it was unknown for me, how exactly these services are set up. Imagine the kubernetes building blocks:
- Docker images (in which you put your actual code and app)
- a Kubernetes cluster, which has pods of containers of images, which create services together, this is where your app run
- [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), the CLI command tool that can manage a kubernetes cluster, at an atomic level
- and now [Helm](https://github.com/kubernetes/helm), which was the missing ingredient - at least for me

Helm aims to be the package manager for kubernetes clusters. These packages are called Charts, where you can define which docker images have to be used in your services later, exact version of images and configuration data.

The configuration also contains the keys for secrets where the data itself will be provided by the k8s cluster’s secret store. (Be sure to avoid storing these in code, as I’ve mentioned this a few times in my [introductionary DevOps talk](/speaking/ruhrjs-2017/))

I’m pretty sure all these could be configured using `kubectl`, but that would be lots of commands, probably redundant, error-prone and time-consuming.

But with Helm Charts, you can define your service in a kube cluster pretty easy - after you get to know what goes where. We should not forget, these charts are versioned, so you can roll back if something went wrong.

### Structure of Helm Charts

A Chart is a collection of files in a directory, the name of this directory is the name of the Chart. Here is a brief description of these
- _Chart.yaml_  
  holds information about the current Chart, version, description etc
- _requirements.yaml_  
  the dependencies of the Chart, it can depend on other Charts
- _Templates/_  
  in these templates, you can define your architecture: services, deployments, replica sets, ingresses, any kubernetes building block you need
- _values.yaml_  
  the data in here will populate fields in the Templates. You can create several of these files, and pick the right one you need, or override any values in these from the CLI commands

So far I've met with simple charts, with a few Templates and Values. Having several value files - staging and production for example - was enough for our needs, and we could version and deploy our services using those. [Here is the complete documentation on Chart contents.](https://github.com/kubernetes/helm/blob/master/docs/charts.md)

### CLI toolset

Before using the helm CLI you have to connect to a kubernetes cluster. Helm will use the cluster information from your `~/.kube/config` file. The basic commands are:

- `helm list`  
  list all the releases
- `helm install`  
  install a Chart to the cluster
- `helm upgrade`  
  upgrade a release to a new Chart version
- `helm delete`  
  delete a release

These are really the most essential commands, there are many other commands, you can check the out at the [Helm Docs](https://docs.helm.sh/)






## Ligatures

While working on a feature, that relies heavily on the contenteditable property of the DOM, this happened:

<video src="{% asset_path "ligature.m4v" %}" autoplay loop title="Short video of how the caret interacts with a ligature in the browser">
</video>

Since I know the work of [@aemkei](https://twitter.com/aemkei), and the [dark magic of zero-width Unicode characters](https://www.google.hu/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&ved=0ahUKEwjnu57CudPYAhWIJ1AKHZ78AtkQtwIILDAB&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DT3xMyZH93i8&usg=AOvVaw34ISWo92p4Vb145hRQ3UN9), I prepared for the worst. Tried to hunt down any, accidentally created ghost character, but there were none. It was really two characters, handled as somewhat one, but the caret did not move while stepping over them. After a short googling the word _“Ligature”_ burned in my brain!

{% blockquote 'Typographic ligature, Wikipedia' 'https://en.m.wikipedia.org/wiki/Typographic_ligature' %}
In writing and typography, a *ligature* occurs where two or more graphemes or letters are joined as a single glyph
{% endblockquote %}

In our case - which is actually a very common one - the letters _f_ and _i_ melted together. The weird thing here is that the browser treats these as two separate characters, it does not move the caret visually, which is really confusing UX-wise - imagine use cases like precise-selecting text.

But it can be turned off, using the powers of CSS!

{% code css %}

    .no-ligature {
        font-variant-ligatures: none;
    }
{% endcode %}

{% image_tag "pull-right" "css-font-examples.png" "examples for font-variant-ligatures, font-variant-numeric and font-variant-alternates" %}

The best place to learn about these is the [W3 spec itself](https://www.w3.org/TR/css-fonts-3/#font-variant-ligatures-prop) and it turned out, it's a long slippery way down the rabbit hole.

There's a lot of these settings and features, some really interesting:
- **font-variant-ligatures**  
  there can be several ways of ligature occurence: the font designer can decide or there are historical typeface rules, or contextual, like joining letters in a script or handwriting font
- **font-variant-numeric**  
  how numeric characters relate to each others, like aligning kerning so they form columns of prices, or displaying fractions
- **font-variant-alternates**  
  the area where font designers can really play around, new design for the capital letter Q, or playing with terminating letters, or just highlighting characters

Important: these are based on OpenType features, so they only work with OpenType feature enabled web fonts. Try these features on Google Fonts: [Google Font OpenType Feature Preview](http://code.thisarmy.com/fontsinfo/)

What's more fun, is that ligatures power many of the emojis, combining them in a various way, for example, flags:

{% blockquote 'Emoji: Fonts, Technically, Colin M. Ford' 'https://medium.com/making-faces-and-other-emoji/emoji-fonts-technically-40f3fdc0869e' %}
Flag emoji like 🇯🇵 are ligatures of special country code glyphs called “Regional Indicators”. There are 26 of them, one for each letter of the Latin alphabet, and two combine to make a flag. For instance, there is no Unicode number for the Japanese flag emoji 🇯🇵, it is made up of two indicators: REGIONAL INDICATOR SYMBOL LETTER J + REGIONAL INDICATOR SYMBOL LETTER P.
{% endblockquote %}

These are combined together using a Unicode "zero-width joiner" (`U+200D` in HTML it's `&#8205;`). If there is a connected form for two characters, putting this one in between them, causes them to appear as their connected variant. Lots of new emoji are created, using such ZWJ's, [here is the complete list of them on Unicode.org](http://www.unicode.org/emoji/charts/emoji-zwj-sequences.html)




## Trigonometry & CSS variables

For this site, I wanted to play with a skewed header and footer background, but leaving these slanted layers there just being static elements looked boring. So why not add some animation?

<video src="{% asset_path "skew.mp4" %}" autoplay loop title="Short video of how the skewed header works">
</video>

{% image_tag "pull-right" "skew-triangles.png" "The right-angled triangles, on the top and the bottom of the skewed rectangle" %}

To animate these leaning layers, I have to update the css `skew` property, by a relatively small degree. If I look at this shape of a skewed background rectangle, the upper / or lower part is a simple [right-angled triangle](https://en.wikipedia.org/wiki/Right_triangle). The value I need, is the angle between it's adjacent and hypotenuse, that has the degree value to skew the background with.

{% image_tag "pull-right" "sin-cos-tan.svg" "Sine, cosine and tangent basics." "https://www.mathsisfun.com/algebra/trigonometry.html" %}

Luckily, the right-angled triangle has some basic rules in trigonometry.

The Opposite and the Adjacent divided gives me the tangent of the skew angle. All I need is two values:
- the Adjacent is the width of the header, which is always the viewport width
- the Opposite will be the skewed height of the header

[Refresh your knowledge on trigonometry](https://www.mathsisfun.com/algebra/trigonometry.html), it can be really useful in usecases like mine!

Using `requestAnimationFrame` on scrolling I can calculate the height of the Opposite value until a maximum pixels, and during this calculation I can set the skew angle, so as the visitor scrolls down, it starts to skew the header or the footer.

Setting a CSS property from JS can be painful for rendering performance. Instead, use CSS variables - or CSS Custom Properties - where the value of a CSS property is bound to a CSS variable, just update the value of the variable from JS, and let the browser sort out the rest.

{% code css %}

    header::after {
        transform: skewY(var(--headerSkew));
    }
{% endcode %}
{% code js %}

    headerElement.style.setProperty(`--headerSkew`, getHeaderSkew() + 'deg');
{% endcode %}

Combining this technique with [FLIP](), enables you to create not just fancy decorative animations, but meaningful and contextual transitions for any UI.