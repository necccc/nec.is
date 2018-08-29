---
title: This month I've learned - January
description: "Loading binary data in the browser, Typed Arrays, the Web Crypto API and smaller goodies this month."
categories:
- writing
tags:
- learning
- binary
- typedarray
- webcrypto
- fetch
---

TL;DR, a quick summary of what’s in this month’s post:

- [Image data as binary](#image-as-binary-canvas)
    - [Tainted canvas](#tainted-canvas)
    - [XHR load array buffer](#binary-xhr)
    - [Streaming binary data with fetch](#binary-stream-fetch)
- [Typed arrays](#typed-arrays)
    - [Subarray vs splice](#subarray)
    - [Concatenating TypedArrays](#binary-concat)
    - [Set data in TypedArrays](#set-data)
- [Web Crypto API](#web-crypto)
    - [Crypto libraries and performance](#crypto-libs-performance)
- [Quick https server for your localhost using docker & nginx](#local-https)
- [Embedding google fonts](#embed-google-fonts)
- [Test your code against all sort of HTTP status code responses out there](#http-status)

This month there was a project where I needed to fetch and process the binary data of an image. We can assume this is going to be easy, as the browser can load images in image tags. As it turned out, accessing the image as binary data is not a trivial task.


## <a name="image-as-binary-canvas"></a> Get image data as binary

In the past, this was Flash territory, but now we have tools like Canvas, ArrayBuffers, TypedArrays, Blobs, URL API and the FileReader API

First, I just had to experiment with canvases, because putting an image on a canvas is so easy. The three ways of getting the image from a canvas:
- `toDataURL(mimeType)`, which basically serialize the image to base64
- `getImageData(x,y,w,h)`, which has to be ran on the context, and provides the data in a TypedArray
- `toBlob(callback, mimeType, quality)`, an async method, resulting in a Blob

All together in an example:

{% code js %}

    const img = new Image();

    img.src = '/cat.png'

    img.addEventListener('load', () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0)

        // dataUrl() basically inlines the image with base64
        const dataUrl = canvas.toDataURL("image/png")

        console.log(typeof dataUrl) // string

        // getImageData() extracts from the Canvas Context
        const imageData = ctx.getImageData(0,0, img.width, img.height)

        // the image data is in a TypedArray of UInt8ClampedArray
        console.log(imageData.data)

        // toBlob() is async, needs a few arguments:
        //    callback,
        //    mime type,
        //    quality
        const blob = canvas.toBlob((result) => {

            // we have a Blob!
            console.log(result);

        }, "image/png", 1)

    })
{% endcode %}


Most examples stop here, announce that it’s done. But if you want to scale things up, this images will probably come from exotic URLs of CDN providers, which are far away from your site on your domain, or your Origin. At this point, trying to get the image data from the Canvas results in a dark and mysterious error message!

### <a name="tainted-canvas"></a> Tainted canvas

{% image_tag "full" "tainted-canvas.jpg" "The Tainted Canvas error message in the console" %}

This means, that the image can be used and displayed in canvas (just like in the IMG tag) but access to its data is locked, for security reasons.

To _cure_ the tainted canvas, you have to make sure, you trust and negotiate with the source where you received the image, simply by using CORS. Supported cross-origin images can be used just as same-origin ones, and you can pull the data.

{% code js %}

    const img = new Image();

    // make sure you have the proper CORS headers here
    img.src = 'https://loremflickr.com/1200/720/nature'
    img.crossOrigin = true;

    img.addEventListener('load', () => {
        ...
    })

{% endcode %}

### <a name="binary-xhr"></a> A better way

If you’ve managed to serve these assets using CORS, there is a more elegant way to get the binary data of images. Simply load them using XHR, but set the `responseType` to “arraybuffer”.


{% code js %}

    const req = new XMLHttpRequest()
    req.open('GET', url, true)
    req.responseType = 'arraybuffer'

    req.onload = () => {
        const buffer = req.response
    }

    req.onerror = (error) => {
        throw error
    }

    req.send(null)

{% endcode %}

You have to load the full image to make this work. You cannot do much with an ArrayBuffer at hand, it’s not even an iterable object, but you can convert it into more usable data formats. (I’ll skip the DataView interface for now).

{% code js %}

    req.onload = () => {
        const buffer = req.response

        const byteArray = new Uint8Array(buffer)
        const blob = new Blob(buffer, { type: 'image/jpg' });
    }

{% endcode %}


### <a name="binary-stream-fetch"></a> Streaming binary data using Fetch

Finally, we can try and parse binary data on-the-fly while it’s being downloaded. The relatively new Fetch API makes this possible, with the help its components, the Request, Response API and the Body mixin.

Turns out the `body` in the arriving `response` instance, is a ReadableStream! If you are familiar with streams in Node.js, you either rejoice or start to look at the screen suspiciously, but here it looks pretty usable.

{% code js %}

const url = 'https://loremflickr.com/1200/720/nature'
const req = new Request(url)
fetch(req)
    .then(response => {

        const reader = response.body.getReader()

        const reading = function ({done, value}) {
          if (!done) {
            console.log('chunk loaded, size:', value.length)
            processing(false, value)
            reader.read().then(reading)
          } else {
            console.log('loaded!')
            processing(true)
          }
        }
        reader.read().then(reading)
    })

{% endcode %}

_(BTW, [loremflickr.com](https://loremflickr.com) is the only placeholder image service so far, that has images with CORS headers.)_

When a chunk has arrived, you can pass its data to further processing, and update a progress bar for example, so it’s pretty useful UI/UX wise too! Check out the whole example in this [gist](https://gist.github.com/necccc/41132d9303a31644536f639e924d15b7).

### Conclusion

Which one is better? That depends...

- use the canvas method if you need an image, and plan to handle the data in a visual context, like cropping, altering
- use the others if you need raw binary data, whatever the mime type is

Loading just any binary data to canvas through images is only possible if you serve the binary as an image `Content-Type`.

Since we’re meddling with binary data, it’s important to take a closer look at TypedArrays

## <a name="typed-arrays"></a> TypedArrays!

TypedArrays are array-like objects, representing binary data. It's not a global property, there is no `window.TypedArray`  but a number of global objects that has the same API. Check out [TypedArrays on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) for all of them!

Some API methods are familiar from the simple Array, but they have a few special ones that are really interesting and useful.



### <a name="subarray"></a> subarray vs slice

{% code js %}

    const hugeBinary = await loadBinaryFrom(url)

    hugeBinary.length
    // 882957

    const firstSliced = hugeBinary.slice(0, 16) // get the first 16 byte
    const restSliced = hugeBinary.slice(16) // get the rest

    const firstSub = hugeBinary.subarray(0, 16)
    const restSub = hugeBinary.subarray(16)

    firstSliced[0] = 0
    // firstSliced is Uint8Array(16) [0, 255, 255, ...
    // hugeBinary is Uint8Array(882957) [255, 255, 255, ...

    firstSub[0] = 0
    // firstSub is Uint8Array(16) [0, 255, 255, ...
    // hugeBinary mutated!! to Uint8Array(882957) [0, 255, 255, ...
{% endcode %}

Both of these methods return a part of the original TypedArray. It seems they do the same, even has the same signature, but there is a major difference in how they provide the data!

- slice creates a **new array**, copying data over from the original  one
- subarray provides an array, where the **values are references** to the original ones

Subarray has a huge performance win, but be aware that altering the values in such a subarray mutates the original source too! If you keep that in mind, it's a great tool to split up binary data into smaller chunks and read/decode them for example



### <a name="binary-concat"></a> Concatenating TypedArrays

First, let it be clear, there is no `.concat()` method on TypedArrays. Binary data structures have fixed length, so you cannot concatenate one to another, neither can `push` or `unshift` data to them.

But you can create new ones from other fixed-length binary arrays, using their values in the .of() method - this way they are concatenated, sort of.

{% code js %}

    const odd = Uint8Array.of(1,3,5,7)
    const even = Uint8Array.of(2,4,6,8)

    Uint8Array.of(...odd, ...even)
    // Uint8Array(8) [1, 3, 5, 7, 2, 4, 6, 8]

{% endcode %}

Another method is using a Blob to glue the TypedArrays together. This may be useful if you're streaming down some larger binary data with a known MIME type, and you need to access it later as a blob url.

{% code js %}

    const collect = []

    collect.push(Uint8Array.of(1,3,5,7))
    collect.push(Uint8Array.of(2,4,6,8))
    // ... and so on

    // concat them in the end
    const gif = new Blob(collect, { type: 'image/gif' })
    URL.createObjectURL(gif)
    // blob:http://..../041f1fac-eda4-4692-ba4d-b1ba47f3d442/

{% endcode %}



### <a name="set-data"></a> Set data in TypedArrays


TypedArray.set takes an array of values and an offset, and copies these values to the target array starting at the offset index. Much cleaner than iterating between indexes and writing them one-by-one, and much faster than splice would be - which is unavailable in TypedArrays.

{% code js %}

    const data = Uint8Array.of(1,2,3,4,5,6,7)
    // our data is Uint8Array(7) [1, 2, 3, 4, 5, 6, 7]

    data.set([8,8,8], 2)
    // data is Uint8Array(7) [1, 2, 8, 8, 8, 6, 7]

    data.set([9,9,9,9], 5)
    // Uncaught RangeError: Source is too large
    //  at Uint8Array.set

{% endcode %}

Keep in mind that binary data is always fixed size, so you cannot use `.set()` to make the TypedArray bigger!



## <a name=""></a> Web Crypto API

This month I had the opportunity to work with the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API), which was really a black box for me until now. Before anyone rushes to use it for encryption or decryption, it’s important to emphasize that it works under **HTTPS only** - which is understandable. We have to get accustomed to the practice of browser vendors, where they enable new web APIs strictly under HTTPS only - and this happens to make the web a better place.

In the simplest example, we encode a string with a password, using some cryptographic algorithm. 

In the example, we’ll import a key from a password. Here we’ll use the AES-GCM algorithm to encode data, which needs a key at least 128 bit long, and an initialization vector of random data, 16 Byte long - both of them should be a TypedArray, so we have to prepare them first

{% code js %}

    const encoder = new TextEncoder("utf-8")
    const pass = "password-has-to-be-128bit-long!!"
    const initialization_vector = window.crypto.getRandomValues(new Uint8Array(16))

{% endcode %}

Now a key has to be created. With the Web Crypto API, the key is not just a piece of string or a password, it has to be an object instance implementing the `CryptoKey` interface. This key object can be generated, derived from a master key or imported, from a password string for example.  Create them using one of the factory methods on the [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) object.

The factory will return a promise, which receives the key when it resolves.

{% code js %}

    crypto.subtle.importKey(
        'raw',
        encoder.encode(pass),
        {
            name: "AES-GCM",
        },
        false,
        ["encrypt"]
    )
    .then(key => { … })

{% endcode %}

We have the key! We can encrypt our super secret string! Just pass the initialization vector, chosen algorithm, the key and the data to the `.encrypt()` method. The result arrives in an ArrayBuffer.

{% code js %}

    const my_secret_text = encoder.encode("wubba lubba dub dub!")

    crypto.subtle.importKey(
        'raw',
        encoder.encode(pass),
        {
            name: "AES-GCM",
        },
        false,
        ["encrypt"]
    )
    .then(key => crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: initialization_vector,
        },
        key,
        my_secret_text
    ))
    .then(function(encrypted) {
        // here's our encrypted data in an ArrayBuffer

    })
    .catch(function(err) {
        console.error(err);
    });
{% endcode %}

Take a look at these [examples using all the cryptographic algorithms](https://github.com/diafygi/webcrypto-examples).



### <a name="crypto-libs-performance"></a> Libraries

If you don’t have Web Crypto support in the target browsers of your web app, or want to encrypt/decrypt on HTTP for some reason, there are several JavaScript implementations of the most used cryptographic algorithms. The most performant may be the [Asmcrypto.js](https://github.com/asmcrypto/asmcrypto.js) from the Tresorit team, check it out!

## <a name="local-https"></a> Quick local HTTPS server
Recently I needed HTTPS on my local machine several times and found out that configuring & running apache on OSX can be tedious. So I’ve created a small nginx setup in docker, that can serve some static files and assets for playing with APIs or prototyping.

Enjoy: [necccc/quick-local-https](https://github.com/necccc/quick-local-https)



## <a name="embed-google-fonts"></a> Embedding Google Fonts

It's still debated if embedding your web fonts in css a good idea or bad idea - caching versus extra requests, but if you ever need to embed your selected fonts from Google Fonts, [this tool might come handy](https://amio.github.io/embedded-google-fonts/).



## <a name="http-status"></a> HTTP Response Statuscode test service
Ever wondered what would your web app, or service do, if it suddenly receives some http status code other than 200 or 403 or 5xx? Test and prepare for those with the help of this nice tool, which can respond with almost any http status code that is commonly used: [httpstat.us](https://httpstat.us/)


