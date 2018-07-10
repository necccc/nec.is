---
title: Upcoming ESNext features - Part 1
date: 2018-06-11
description: "I've handpicked some of the top features that I (a)wait most for JavaScript, let's see the first three"
categories:
- writing
tags:
- esnext
- ecmascript
- tc39
- learning
- pipeline
- partial evaluation
- decorators
---

Recently I took a look at JavaScript features still in the proposal stage and handpicked the 10 top features that I (a)wait for JavaScript. It would be too long for a single post, so I've sliced it to three posts. Let's check out the first three:

- [Pipelines](#pipelines)
- [Partial Application](#partial-application)
- [Decorators](#decorators)


<a name="pipelines" class="anchor post-intro"></a>
##   Pipelines

Pipes and pipelines are common in other languages, not just Elm or Hack, but take the UNIX pipe itself. It's really a great tool, and in JavaScript, the closest we got is maybe the chaining pattern, like in jQuery or the Promises.

In chaining, you have to build a chain using the same object or instance, which has to return itself over and over again. With pipelines, you can build powerful data processing chains, using totally independent functions or modules, which has to return a simple value, instead of some mega-structure.

If you're familiar with the [`componse` method of the async](https://caolan.github.io/async/docs.html#compose) library, that may be similar to the pipeline idea. In compose, every provided function receives the return value of the preceding function, until the pipeline ends with a return value.

```js

    const getName = function (data) {
        return data.firstName
    }

    const capitalize = function (str) {
        return str[0].toUpperCase() + str.substring(1)
    }

    const greet = function (name) {
        return `Hello ${name}!`
    }

    // composing functions into a pipeline
    // using async.compose

    const greetUser = async.compose(
        getName,
        capitalize,
        greet
    )

    greetUser({ fistName: 'john' }, (greeting) => console.log(greeting))
    // Hello John!

```

Note that `async.compose` is async by design, and consecutive functions will wait for each other.

### Pipes |>

The [Pipeline Operator proposal](https://github.com/tc39/proposal-pipeline-operator) would like to solve this without dependencies, and the opt-in for async operation too. The following example would look like this using the proposal:

```js

    // composing functions into a pipeline
    // using the Pipeline Operator

    const greeting = { fistName: 'john' }
        |> getName
        |> capitalize
        |> greet

    console.log(greeting)
    // Hello John!

```

Quick explainer what happens here:

```js

    const returnValue = initialData
        |> pipedFn1 // takes initiaData as input
        |> pipedFn2 // takes whatever putput came from pipedFn1
        |> pipedFn3 // takes whatever putput came from pipedFn2

        // returnValue is the value that returned from pipedFn3

```

It's simple so far, although the notation might be a bit confusing at the first time. But let's move on!

The function `getName` could be async, initiate and wait for an AJAX request to complete. The old `async.compose` handles that well, but let's see what the new proposal suggests:


```js

    // composing functions into a pipeline
    // using the Pipeline Operator
    // one of the piped functions is async

    const userId = 1234

    const greeting = userId
        |> await getName
        |> capitalize
        |> greet

    console.log(greeting)
    // Hello John!

```

May look even simpler, but there's a catch! What does `await getname` means here on Line 9?

```js
    // is it
    await getName(userId)

    // or
    (await getName())(userId)

```

To solve this confusion, there are two competing proposals on the table right now.

 - [Smart piplelines](https://github.com/js-choi/proposal-smart-pipelines/blob/master/readme.md)
 - [F# pipelines](https://github.com/valtech-nyc/proposal-fsharp-pipelines/blob/master/README.md)

I'll re-write the example again using each of them, so the difference is visible:

```js

    const userId = 1234

    // this would be the solution of the F# Pipeline proposal
    const greeting = userId
        |> getName // the awaited function precedes the await keyword
        |> await
        |> capitalize
        |> greet

    console.log(greeting)
    // Hello John!

    // this would be the solution of the Smart Pipeline proposal
    const greeting = userId
        |> await getName(#) // we use a placeholder
        |> capitalize
        |> greet

```

The F# proposal separates the `await` keyword from its async function in the pipeline, so it shows what will be awaited. The Smart Pipeline use a placeholder to tell the pipeline, where to put the return value of the preceding operation. This also offers more versatile use of the placeholder.

[Pipelines](https://github.com/tc39/proposal-pipeline-operator) could be a powerful feature, simplifying flows that were too explicit, or needed a library before. It's currently in **stage 1**, the decision between the F# and the Smart one has to be made.

They could be even more useful, with the Partial Application feature, so let's take a look at that!


<a name="partial-application" class="anchor"></a>

## Partial Application

One of my top favorites. If you've tried doing functional programming in JS, or ever used `_.partial` from [lodash](https://lodash.com/docs/4.17.10#partial), you'll going to love this.

Partially applicating a function means, that you can take a function with more than one arguments, and run it with a number of arguments, that is less than its airity - the number of total arguments it takes. This will give you another function, that you can take and run with the rest of the arguments later. You run or apply it, _partially_.

Usually, this is achieved using some utility function. A classic example of this is an adding function:

```js

    const add = function (a, b) { return a + b }

    const addOne = _.partial(add, 1)
    const addTen = _.partial(add, 10)

    addOne(2) // 3
    addOne(6) // 7

    addTen(2) // 12
    addTen(6) // 16

    // or use it as an iterator
    [ 1,2,3 ].map(addOne) // [ 2,3,4 ]
    [ 1,2,3 ].map(addTen) // [ 11,12,13 ]

```

The problem with using utility functions like this, or using `.bind()` or `() => {}` is that you have to manage scope, argument order, implementing argument placeholders, or simply put it: rely on a library as a dependency.

The [Partial Application proposal](https://github.com/tc39/proposal-partial-application) would solve this on the native level, plus add some great features too.

### Argument placeholders ... ?

The subtitle format is not a suspenseful question :) The proposal has two placeholder tokens, the `?` for a single argument and the `...` for multiple, more specifically, "rest of the arguments".

```js

    const add = function (a, b) { return a + b }

    const addOne = add(1, ?) // will return a function, that needs one argument

    addOne(2) // 3
    addOne(6) // 7

    [ 1,2,3 ].map(addOne) // [ 2,3,4 ]
```

This placeholder can be used in any order, or even multiple times:

```js

    const greet = function (greeting, to, name)  {
        return `${greeting} to ${to}, ${name}`
    }

    const welcomeTo = greet('welcome', ?, ?);
    const welcomeToMyBlog = welcomeTo('my blog', ?);

    welcomeTo('Disneyworld', 'Goofy') // welcome to Disneyworld, Goofy
    welcomeToMyBlog('Szabolcs') // welcome to my blog, Szabolcs

```

The `...` - "rest of the arguments" placeholder can be used from the left or right, replacing the first or last part of the argument list:

```js

    const largestThanTen = Math.max(10, ...)

    largestThanTen(2, 7, 11) // 11
    largestThanTen(6, 5, 4) // 10

```

A quick explainer on how it should work, from the  [proposal](https://github.com/tc39/proposal-partial-application) itself.

```js

    const x = 42

    fn(x, ?)           // partial application from left
    fn(x, ...)         // partial application from left with rest
    fn(?, x)           // partial application from right
    fn(..., x)         // partial application from right with rest
    fn(?, x, ?)        // partial application for any argument
    fn(..., x, ...)    // partial application for any argument with rest

```

Check out the [proposal](https://github.com/tc39/proposal-partial-application), for operation details, handling scope, and how it should handle side effects, like changing already applied arguments passed in as variables.

It's currently in **stage 1**, and has several [concerns already](https://github.com/tc39/proposal-partial-application/issues)


<a name="decorators" class="anchor"></a>

##  Decorators

This powerful new feature enables us to enhance Objects and Classes further than `defineProperty`. You can write libraries that can be used later to add extra functionality and behavior to a Class, its methods or even its fields.

Decorators can be used on three declaration points in your code:
- whole Classes
- method declarations
- field declarations, even with setters and getters

See the following example from the current proposal:

```js

// Decorator used to pass this whole class to "window.customElements.define"
// with the tagName "num-counter"
@defineElement('num-counter')
class Counter extends HTMLElement {

  // Decorator used to observe the field x,
  // and call the "render" method every time its value updates
  @observed
  x = 0;

  // Decorator used to create a method that is already bound to this instance
  // so we can use just "this.clicked" as a callback everywhere
  // without the need of ".bind()"
  @bound
  clicked() {
    this.x++;
  }

  constructor() {
    super();
    this.onclick = this.clicked; // we can do this since we've used the @bound decorator
  }

  connectedCallback() { this.render(); }

  @bound // the @observed decorator relies on a bound "this.render"
  render() {
    this.textContent = this.x.toString();
  }
}

```

The example above creates a counter component that updates its text content every time it was clicked. The extra behavior of observing values, binding callbacks to the class instance and the creation of the custom HTML element itself are extracted to Decorators, so they can be re-used on other components - while sticking to a familiar and clean Class structure.

The [Decorators proposal](https://github.com/tc39/proposal-decorators) is in **Stage 2**, and this [article on its API](https://github.com/tc39/proposal-decorators/blob/master/METAPROGRAMMING.md) shows how to implement your own decorators in the (hopefully) near future.


That's it for today, [check out the next three features](https://nec.is/writing/upcoming-esnext-features-part-2/):
- Bind operator
- Top-level await
- Optional Chaining