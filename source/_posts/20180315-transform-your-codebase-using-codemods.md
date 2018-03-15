---
title: Transform your codebase using codemods
description: "Learn about jscodeshift, a super-useful tool to step by step transform large codebases using small changes."
categories:
- writing
tags:
- learning
- ast
- jscodeshift
- codemods
---

This post will teach you about [jscodeshift](#jscodeshift), a super-useful tool to step by step transform large codebases using small changes. From the basics, like how to [traverse](#traverse) your code and how to [build code](#build), through some detailed look at the data you work with, like [Collections](#collection) and [NodePaths](#nodepath).

At the end I'll write about [ignore patterns](#ignore-patterns) for jscodeshift, plus some [best practices](#best-practices) we've learned and handling [edge cases](#edge-cases) in code

## Codemods

Codemods are small programs designed to alter large codebases with a very specific change.  Historically they were using simple string replacement techniques, and later complex regular expressions.

Luckily for us these days, source code in many languages can be traversed using an Abstract Source Tree (AST) which makes these changes more safe, powerful and easy at the same time. Let’s see how useful these little programs can be!

### Use case

For example, if you wish to upgrade a library you use, but it introduced a breaking change, by radically altering the signature of its methods. You could search & replace all the occurrences of the used library, but that has many downsides:

- manual, repetitive and boring - you may miss something
- creates a huge changeset
- teammates working on the codebase on a different branch has to merge and resolve conflicts 

If you can forge a tool to do the changes for you, automated, all these can be solved!

- it’s automated, you just have to write the codemod 
- the changeset is basically the codemod only
- run the change, and test it before release, test it on branches, the result of the codemod is the same everywhere
- if a conflict happens, your teammates can ignore your codemod-enhanced version, accept theirs, and re-run your codemod again on their code - easily resolved!

<a name="jscodeshift"></a>

## jscodeshift

[In 2015 at JSConf EU](https://www.youtube.com/watch?v=d0pOgY8__JM&t=57s), [Chris Pojer](https://twitter.com/cpojer) from Facebook introduced a tool called [jscodeshift](https://github.com/facebook/jscodeshift). It’s a codemod runner, wrapping around a module called [`recast`](https://github.com/benjamn/recast) which enables us to traverse, search and alter the source code using simple tools.

This is how installing jscodeshift, and running codemods on a codebase looks like

{% code bash %}

$ npm i jscodeshift -g

$ jscodeshift -t some-codemod.js /path/to/the/codebase
{% endcode %}

A codemod is a function, which receives the source code (as a string), the jscodeshift API and some options, and expected to return the source code as a string. 

{% code js %}

module.exports = function(file, api, options) {

	const { source, path } = file
  // `source` is the source code in file at `path`

	const { jscodeshift, stats } = api
	// use `jscodeshift` to access the API
	// `stats` is a function to collect statistics 
	// during --dry runs

	// do some magic here...

  // return the changed source as string
  return source;
};
{% endcode %}

<a name="traverse"></a>

### Walking and Searching in the Source Tree

Finding a certain code structure can be done simply by providing a pattern or the absolute specific way, using filters, depending on exactly what you’re searching for.

If you can explicitly tell yourself what is that you are looking for, you can show a source tree structure pattern to jscodeshift to look for. For example, let's find any `smoosh` method calls on a `library`  object

{% code js %}

// the jscodeshift api has been assigned to j previously

const ast = j(source)

ast.find(j.MemberExpression, {
	object: {
	  name: 'library'
	},
	property: {
	  name: 'smoosh'
	}
  })

{% endcode %}

If you want to look for some computed value, you can use a filter

{% code js %}

// the jscodeshift api has been assigned to j previously

const ast = j(source)

// find all MemberExpressions on object `obj.`
ast.find(
	j.MemberExpression, {
	  object: { 
		name: 'obj'
	  }
	}
  ).filter((path) => {
	const { name } = path.value.property
	  // filter all accessed properties that starts with `get` 
	return /^get[A-Z].*/.test(name)
  })
{% endcode %}

<a name="build"></a>

### Builder API

After you’ve found what you’re looking for, it’s time to create nodes for replacement or insertion. Jscodeshift wraps the Builder API from `recast`,  so let’s use it! The difference from the matcher constants, like `jscodeshift.Literal`  is that they start lowercased, and all of them is a function call, like `jscodeshift.literal('foo')`. You might guess, this will create a simple string literal, with the string “foo”.

These builders have different function signatures, depending on the properties of the nodes they create. `Literal` needs a simple string as the value, but a CallExpression for example, needs much more, like a callee, and the arguments list:

{% code js %}

// create a function call that looks like
// "myfunc(someVar, 'bar')"
const callExpr = j.callExpression(
  j.identifier(‘myFunc’), 
	[
	j.indentifier('someVar')
	j.literal('bar'),
  ]
)
{% endcode %}

The documentation for these is basically nonexistent, but if you take a look at the definitions over [`ast-types` ](https://github.com/benjamn/ast-types/tree/master/def) it’s actually readable. For example in the [core ES definitions](https://github.com/benjamn/ast-types/blob/master/def/core.js)  the `CallExpression`  looks like this

{% code js %}

	def("CallExpression")
		.bases("Expression")
		.build("callee", "arguments")
		.field("callee", def("Expression"))
		// See comment for NewExpression above.
		.field("arguments", [def("Expression")]);
{% endcode %}

In this - and every definition in there - the `build` contains the expected function signature, and every field is described for what type is required.

With the help of the ast-types definitions, you can create powerful builder structures, and update your code easy. 

**Note:** Using the builder API with jscodeshift methods does not necessary ensures that the resulting code will be valid! So always test your codemod, double-check what it does.
Example:

{% code js %}

ast
  .findVariableDeclarators(‘foo’)
  .insertAfter(
	j.indentifier('bar')
  )
// this alters code from
//	 const foo = 'asd';
// to
//	 const foo = 'ast, bar; 
// which is invalid!

{% endcode %}

Now let's take a deeper look at the data structures you can work with when creating a codemod.

## Collections, NodePaths, Nodes

The data you can retrieve from jscodeshift consists Collections, NodePaths, and Nodes.
 - Collection is an array of NodePaths, spiced with some helper methods
 - [NodePaths](#nodepath) are wrappers around Nodes to provide context and helpers,
 - Nodes are the actual AST nodes

<a name="collection"></a>

### Collection

It’s an array of NodePaths, usually the result of `find` or `filter` or similar traversing and searching methods.

The basic methods are relatively [well-documented](https://github.com/facebook/jscodeshift/wiki/jscodeshift-Documentation) but there are some useful ones missing from there, or just need an example.

**paths()**

Get the NodePaths from the collection in an array

**closest()**

Returns the closest provided node type up in the AST to each of the nodes.

{% code js %}

// find all member expressions of the `obj` object
ast.find(
  j.MemberExpression,
  {
	object: { 
	  name: 'obj'
	}
  }
).closest(j.CallExpression)
// returns method calls like `obj.foo()` 
// but not the property access like `obj.bar`

{% endcode %}


**findVariableDeclarators([name])**

find variable declarations in collection, optionally filtered by `name`

{% code js %}

ast.findVariableDeclarators(‘foo’)
///same as running this
ast.find(jscodeshift.VariableDeclarator, { id: { name: ‘foo’ }})

{% endcode %}

**insertAfter()**
**insertBefore()**

insert nodes after each collection item. Pass in an array of Nodes, using the Builder API - but unfortunately, usage is not that trivial. 
For example, if you want to simply add a new line below a selected Node, you have to traverse up to the closest ExpressionStatement and insert after that one.

{% code js %}

ast
	.find(j.CallExpression)
	.closest(j.ExpressionStatement)
	.insertAfter([
		j.expressionStatement(
			j.callExpression(
				j.identifier('asd'),
				[]
			)
		)
	])
{% endcode %}

You can pass a function to insertAfter/Before, which returns the array of Nodes to be inserted.

{% code js %}

// insert a track() call after every function call
// passing in their numeric index in the code
const createTracker = (path, index) => {
	return j.expressionStatement(
	  j.callExpression(
		j.identifier('track'), 
		[ j.literal(index) ]
	  )
	)
  }

 ast
   .find(j.CallExpression)
   .closest(j.ExpressionStatement)
   .insertAfter(createTracker)

{% endcode %}

**remove()**
remove the collection from the AST

{% code js %}

ast.findVariableDeclarators('foo').remove()

ast.find(j.CallExpression, {
	callee: {
		object: { name: 'console'},
		property: { name: 'log'},
	}
}).remove()

{% endcode %}

**renameTo(newName)**

renames all Identifiers in the collection of *VariableDeclarators* to `newName`

{% code js %}

  jscodeshift(source).findVariableDeclarators('foo').renameTo('bar')

{% endcode %}

**replaceWith([nodes|function])**

replace collection with the provided array of nodes of the result of the provided function

this function receives the NodePath and the iteration index as arguments and expected to return an Array-like collection

{% code js %}

// replace variable name ‘lorem’ to ‘ipsum’ at every code occurrence
ast.find(j.Identifier, {name: ‘lorem’ })
	.replaceWith(
		j.identifier(‘ipsum’)
	)
{% endcode %}

{% code js %}

// replace console.log() to another logging target,
// while keeping the passed arguments
  ast.find(j.CallExpression, {
	callee: {
	  object: { name: 'console'},
	  property: { name: 'log'},
	}
  }).replaceWith((path) => {
	return [
	j.callExpression(
		j.identifier(‘mylogger’), 
		path.value.arguments
		)
	]
  })
{% endcode %}

<a name="nodepath"></a>

### NodePath

These methods come from recast

**canBeFirstInStatement(), firstInStatement()**

Check a Node’s place in a statement, and if a Node can be first.

**needsParens()**

Check if a Node needs to be wrapped in parentheses (it’s mainly used by the `recast` code builder)

**prune()**

Remove a node and its parent, if it would leave a redundant AST node - comes from `ast-types`

**replace()**

Replace a Node with another one

**Properties**

- _parent_ - traversing up the AST, the parent NotePath
- _scope_ - get scope information, like these:
	- _isGlobal_ - is it the global scope
	- _bindings_ - get scope bindings (honestly, I could not get my head around this)
	- _depth_ - how deep is this node in the scope chain
	- _path_ - the NodePath of the scope in the AST
	- _getGlobalScope()_  - access the global scope
- _node, value_ - return the wrapped Node


## AST Node types, Best practices, and Edge cases

> It's OK to not know the structure of every AST node type.

This is 100% true, no-one should say that every true JS developer should know these. To help, there is a wonderful online tool called [ASTExplorer](https://astexplorer.net/), where you can write/paste the code, and see the relevant AST nodes on the right, as you click in your code. You can test and debug your jscodeshift codemod right there, just pick the right option in the “Transform” menu at the top.

<a name="ignore-patterns"></a>

### Ignore patterns

Just like in a .gitignore file, you can set paths or path fragments, that should be avoided by your codemods. We skip 3rd party libraries, node_modules, vendor modules for example. You can put these in a file, and pass it to the runner, like this

{% code bash %}

$ jscodeshift -t some-codemod.js --ignore-config ignores.txt /path/to/the/codebase

{% endcode %}

Here’s an example file for jscodeshift ignore-config

{% code txt %}

vendor
node_modules
*config*.js

{% endcode %}

<a name="best-practices"></a>

### Best practices

We started to write codemods on separate workbranches/pull requests. Only the codemod is committed, and any changes it may need to run, and any dependencies it brings to, or updates in the codebase. In a nice docblock at the top of the file, we describe what this codemod should do, what it should *not* do, and include the exact CLI commands we’ve run it - it’s useful when your teammates need to run it, or if a custom ignore pattern was used.

Then we run the codemod on a pre-release branch, where it’s tested and released before merging the whole changeset to master.

Anyone who has a conflict after pulling master, can ignore the change, and re-run the codemod on the files they’re working with.

<a name="edge-cases"></a>

### Edge cases

If you find a piece of code that has some unconventional approach compared to what you try to modify, do not over-engineer and over-complicate your codemod. 

You can create a separate codemod for that use case, or - even better - you can refactor the unconventional approach in a way, that your codemod can handle.

I hope you've found this post useful, and it will help you take your codebase to the next level of JavaScript! Here’s a collection to [update your codebase to modern JS](https://github.com/cpojer/js-codemod/) and a [small collection of other useful examples](https://github.com/jhgg/js-transforms).
