---
title: "Nextjs + GraphQL: tune for performance"
description: "next"
date: 2018-07-27
categories:
- writing
tags:
- graphql
- cache
- apollo
- react
- nextjs
- performance
---

I've discovered NextJS few months ago, as a solution for Server-side Rendered React, and I'm playing with it since, integrating with various solutions for i18n, state management, routing etc. Some weeks ago I've tried it out with GraphQL, building a small page with these tools. This post is the summary I learned about some performance-tuning techniques, I will detail each of them, after a quick intro to the tools I've used:

 - [Quick Introduction to Next.js, GraphQL and Apollo](#intro)
 - [Paginating lists](#paginating-lists)
 - [Instant navigation from lists to details with lazy loading the data](#list-to-details)
 - [Subtree pagination of a dataset](#subtree-paging)

<a name="intro" class="anchor post-intro">

## Next.js & GraphQL & Apollo

First let's have a quick intro on the building blocks: Next.js, GraphQL and the Apollo suite for GraphQL. I promise I'll list some great resources on these later in this post.

### Next.js

{% image_tag "pull-right" "nextjs.svg" "The Next.js logo" %}

[Next.js]() is a framework for server-rendered React apps - it can generate static sites too, but it works great with dynamic sites as well. A powerful Webpack setup, Server-side rendered React and routing packed together to a small framework. If you want to elaborate things and get more dynamic, you can plug it on a web framework like Express, Hapi or Koa, and use their routing, middleware, everything.

It works with React like a charm! Next.js relies on an extra static method on your components called `getInitialProps()`, that you can define to fetch initial data in your props, both for server-side or client side rendered components. This dead-simple pattern is really useful, and simplifies your code you're writing for first render and then the client-rendered pages, as the user navigates in your routing.

As for development experience, it provides a dev mode, where Webpack HMR shines brightly, and shows your updates instantly, or hits you in the face with errors, so you can clearly see that something is wrong. It's build process creates Webpack chunks next to the server-side code, can be deployed easily, even utilizing some CDN for the static assets and chunks.

### GraphQL

{% image_tag "pull-right" "graphql.svg" "GraphQL logo" %}

Facebook came up with GraphQL few years ago, to solve their problems around verbose and network draining APIs. It's not a framework, nor a library, its just a **query language** and as such, can be implemented in several languages fro both server-side and client-side.

GraphQL aims to solve several painful problems around APIs:

- **you ask for what you need, and you receive only what you need**  
This solves the so called _overfetching_ phenomenon, when a RESTful API endpoint gives you tons of properties, but you need only the name and the picture of an item.

- **single endpoint, single request, many resources**  
You can ask for as many types of resources as many you want in just a single Query! Resources will be resolved from other REST APIs, database connections - and you don't have to know about them.

- **Schema with a type system**  
The Schema holds all the Types of resources, properties, possible variables you can use, even caching hints! It ensures meaningful errors if you misspell something, and provides predictable data types.

- **API development without versioning**  
You can add new properties or fields or even whole Types without deprecating the whole API, and vice versa: you can mark fields as `@deprecated` so clients will know about the upcoming changes while remaining operational.

### Really quick GraphQL intro

GraphQL has two types of operations, Query (read) and Mutation (write). These are decided on a higher level, in the commands themselves, so usually all Queries and Mutations are sent over POST requests.

I'll quickly explain the basic terms of GraphQL with some examples. First, lets see the Schema, defining a GraphQL service:

```graphql
# Schema definition
#
# Fist, we define a resource Type, called Person
type Person  {
	id: ID!
	# this is a Field of Scalar Type String,
	# the ! shows it cannot be null
	name: String!
	# this is a Field of Scalar Type Integer
	height: Int
	bio: String
	picture: String
}

# this resource Type has a relation with another resource Type
type Starship  {
	id: ID!
	name: String!
	model: String
	picture: String
	owner: Person    # this field will contain data of a Person type
}

# the root Query, every QraphQL service has one
# listing the resources available for fetching:
type Query {
	# will return with Person with
	# the ID passed in the argument
	Person(id: ID): Person

	# this query will return a list (array) of Persons,
	# default page is 1
	allPersons(page: Int = 1): [ Person ]

	# will return with Starship with
	# the ID passed in the argument
	Starship(id: ID): Starship
}


# Schemas for Mutations
#
# like the root Query, there is a root Mutation type,
# for every service, that shows what data can be mutated and how
type Mutation {

	# mutations can use your resource Types as schemas,
	# since they already define their fields and types

	# this can be away to create a Person,
	# but you might get lost in the parameters,
	# so I would advise against it
	addPerson(name: String!, height: Int, bio: String, picture: String ): Person
}


# create a new kind of Type instead, an Input Type!
# this defines a data schema that will be sent to the server
# as a new record, or record update
input CreatePerson {
	name: String!
	picture: String
	height: Int
	bio: String
}

# now the addPerson Mutation from earlier can be this
type Mutation {

	addPerson(person: CreatePerson): Person!

	# this Mutation returns a Person Type resource as a response
	# the new Person that has been created
}

```

These above helps you define a GraphQL service, the Schema, which you can read as a client, to see the types, names and fields as a living documentation. Now let's see some Query and Mutation operations form the client's perspective!

```graphql

# Queries
#
# fetch some fields of a resource with an id
# this will return only the ID and the name of the Person
query PersonMinimal($id: ID) { # this is the name of the query
    Person(id: $id) {          # this is the actual resource you're getting
		id
		name
    }
}

# same resource type, but with all fields
query PersonFull($id: ID) {
    Person(id: $id) {
		id
		name
		picture
		bio
		height
    }
}

# get the list of Persons
# arguments will be passed in with the help of your client library
# in this case if the page argument is not present,
# the default value is 1
query PersonList($page: Int = 1) {
	allPersons(page: $page) {
		id
		name
		picture
	}
}

# get a Starship with its pilot Person!
# We only need the person's id, picture and name,
# we don't need height and full bio here.
# This is best part of GraphQL!
query getStarship($id: ID) {
	Starship(id: $id) {
		id
		name
		model
		picture
		owner { # here a Person type will be served
			id
			name
			picture
		}
	}
}


# lets have a mutation
# we'll use the CreatePerson Input Type that was defined in the schema
mutation UploadNewPerson($person: CreatePerson) {
  addPerson(person: $person) {
    name # we will use only the name from the newly created and returned Person entry
  }
}

# for this mutation, this parameter provides the new Person data
# it has to match the CreatePerson type scheme
{
  "person": {
    "name": "Kara Thrace",
    "picture": "https://img.url/kara.png",
    "height": 173
	}
}

```

There are more details and useful features, that could fill a whole blogpost, be sure to check out the [official GraphQL docs](http://graphql.github.io/)!

### Apollo

{% image_tag "pull-right" "apollo.svg" "Apollo Platform logo" %}

Apollo is a GraphQL toolset that works great with REST APIs as backend resources

schema & resolvers
apollo server & engine

queries, mutations
apollo client + react



## Performance tuning

graphql itself is designed to help achieve performant UIs, lets fine tune it even further

### Lists, pagination

start with lists
list query, schema
returns Types, fields
anatomy of the props by Apollo Client


pass in fetchMore
using fetchMore at pagination



<div class="youtube full"><iframe src="https://www.youtube.com/embed/BbdPPQ094wg?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=0&amp;loop=1&amp;playsinline=1&amp;modestbranding=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="full"></iframe></div>

### Navigating from Lists to Details


goals:
navigate to the detail page from the list, w/o page load or waiting and use lazy data fetch
introduction to cache & cache redirects
double query, first with the same query schema as in list
instant render
fetching data, loading
done!



<div class="youtube full"><iframe src="https://www.youtube.com/embed/ZopsOkX_AjI?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=0&amp;loop=1&amp;playsinline=1&amp;modestbranding=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="full"></iframe></div>





### Subtree Pagination

this was the toughest, but if we stick to familiar react best practices, like hoisting state, it's clear

lets say we have some related data on details page, that is huge and would take several seconds to resolve for the graphql server
paginate subtree in schema
ask the first page only
fetch data later, if needed

details fetch only the first page of related data, render when ready
compose the component rendering the related info with it's own query for paginated relating data
put related pagination data to detail page state
at first render, skip the relating query, since we already have the data
the related component should not update it's own state for next page, lets hoist that data up to the details page state
the button now updates the state in the parent component
on state change, flip the skip flag, update the page metadata, and let the related query run


<div class="youtube full"><iframe src="https://www.youtube.com/embed/TwNmQQfQacw?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=0&amp;loop=1&amp;playsinline=1&amp;modestbranding=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="full"></iframe></div>





## Links & resources

the apollo server on github
the next+graphql app on github
next
next tutorials
remy's next course
graphql
apollo server & engine
apollo client with react
next on spectrum.chat
apollo on spectrum.chat