---
title: 10 most exciting ESNext features to keep an eye on - Part 2
description: "Hand picked the 10 top features that I (a)wait for JavaScript, lets see the next five"
categories:
- writing
tags:
- esnext
- ecmascript
- tc39
---



## Bind operator ::

The fat arrow function and the way it utilizes lexical scope solved most use cases of binding context. But still, there are some places, where proper scope binding has to be used. The `bind, call, apply` methods are a bit awkward in these contexts, so the TC39 is considering the introduction of this operator.

Such use case, for example, is when we would like to run a function with an injected `this` or extract a method from an object as a function but bound to the context of the object it originates from.

```js

    // pass in `this` to a function
    const elements = document.querySelectorAll("div")

    const filterCollectionByClass = function (classname) {
        return Array.from(this).filter(item => item.className.indexOf(classname) >= 0)
    }

    // current solution
    filterCollectionByClass.call(elements, 'has-classname')

    // using the Bind Operator
    elements::filterCollectionByClass('has-classname')


    // use `console.log` as a function, bound to `console`
    // current solution
    [ 1,2,3,4,5 ].forEach(console.log.bind(console))

    // using the Bind Operator
    [ 1,2,3,4,5 ].forEach(::console.log)

```

Let's have a quick explainer on what happens above:

```js

    ::instance.method
    // returns a "method" function, bound by context to the "instance"
    // so inside "method" the "this" will point to "instance"

    variable::method(arg1, arg2, ...)
    // runs the "method" function with "variable" as context, and optional arguments
    // so inside "method" the "this" will point to "variable"

```

The important difference here is that the first notation creates a function that can be re-used, and the second one actually runs the function.

It's clear that the [proposed syntax](https://github.com/tc39/proposal-bind-operator) is more readable in these situations, so let's hope it moves up the stage ladder soon!




## Top-level await
https://github.com/tc39/proposal-top-level-await
https://gist.github.com/Rich-Harris/0b6f317657f5167663b493c722647221

Stage 2



## Private & static fields
https://github.com/tc39/proposal-class-fields
https://github.com/tc39/proposal-static-class-features
https://github.com/tc39/proposal-private-methods

Stage 3


## Realms
https://github.com/tc39/proposal-realms

Stage 2


## Optional Chaining
https://github.com/TC39/proposal-optional-chaining

Stage 1

## Nullish Coalescing
https://github.com/tc39/proposal-nullish-coalescing

Stage 1

## Throw expressions
https://github.com/tc39/proposal-throw-expressions

stage 2