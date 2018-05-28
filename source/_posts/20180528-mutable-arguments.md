---
title: When arguments are mutable
description: "An exact case, when omitting strict mode can cause weird side effects"
categories:
- writing
tags:
- learning
- arguments
- function
- strict mode
---

I've found this weird behavior of the `arguments` inside a function while playing and experimenting with some code some days ago. Normally it would not be interesting since all the code we use is usually built-transpiled and put into strict mode, but my sandbox was not - and this is an exact case when omitting strict mode can cause weird side effects.

## Arguments

Lets start with the famous `arguments` object found in almost<sup class="sidenote" title="Fat arrow functions are scoped lexically and do not have their own arguments variable">*</sup> every function in JavaScript.

Quickly go over what you can and cannot do with `arguments`.

You can

- access the passed arguments using a zero-based index
- access its length
- use it with the spread operator
- completely overwrite it in non-strict mode
- iterate over it using for-of
- update values in it, using indexes
- attach static methods and properties on it

You cannot

- use array methods on it
- add new items
- remove items from it

Looks pretty clear, right? Now, let's get down the rabbit hole...

## Tracking and mutating

Focus on our mutable arguments object right now. Take a look at this piece of code, and try to guess what is written to the console:

{% code js %}

var bar = function (a) {
  a = 'foo'
  console.log(arguments[0])
}

bar(2)
{% endcode %}

Just by looking at the code, we think it should log **2**. But here comes the strange quirk, it will log **"foo"**. If you don't believe me, [try it out yourself](https://jsbin.com/bojirab/1/edit?js,console).

What just happened?! Turns out there is a maintained relationship between the arguments of a function, and the arguments object, when certain conditions apply:

{% blockquote 'Arguments tracking the arguments object' 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments#Rest_default_and_destructured_parameters' %}
When a non-strict function does not contain rest, default, or destructured parameters, then the values in the arguments object do track the values of the arguments (and vice versa).
{% endblockquote %}

This works vice-versa, altering either the named argument or an entry in the arguments object, will track the changes to the other one:

{% code js %}

// non-strict function, not containing rest,
// defaults or destructured parameters
var fn1 = function (a) {
  a = "foo"
  console.log(arguments[0])
}

// argument `a` tracks arguments[0]
fn1(2) // "foo"

var fn2 = function (a) {
  arguments[0] = "bar"
  console.log(a)
}

// arguments[0] tracks argument `a`
fn2(2) // "bar"

{% endcode %}

Using strict mode, or working with rest, defaults or destructured arguments will prevent this weird behavior

{% code js %}

// using strict mode
var fn3 = function (a) {
  "use strict";
  a = "foo"
  console.log(arguments[0])
}

// arguments, and the arguments object no longer track each other
fn3(2) // 2

// containing rest, defaults or destructured parameters
var fn4 = function (a = 0) {
  arguments[0] = "bar"
  console.log(a)
}

fn4(2) // 2

var fn5 = function (...args) {
  arguments[0] = "bar"
  console.log(args[0])
}

fn5(2) // 2

var fn6 = function () {
  const [a] = arguments
  arguments[0] = "bar"
  console.log(a)
}

fn6(2) // 2
{% endcode %}

Check out these examples as real code [in this bin](https://jsbin.com/zoyicoh/5/edit?js,console).

Quirks like this can cause side effects, and severe bugs later in your code, so be safe! The following tricks can help you, to keep your code sane:

- use strict mode whenever possible, not just in your compiled, authored code
- use ESLint, with rules like [no-param-reassign](https://eslint.org/docs/rules/no-param-reassign)

---

**PS:** this is totally different, when you assign an argument to a variable _inside_ the function, like here

{% code js %}

var bar = function (a) {
  var aa = arguments[0]
  a = 'foo'
  console.log(aa)
}

//this works as expected
bar(2) // 2
{% endcode %}







