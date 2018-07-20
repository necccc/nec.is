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

I've discovered NextJS few months ago, as a solution for Server-side Rendered React, and I'm playing with it since, integrating with various solutions for i18n, state management, routing etc. Some weeks ago I've tried it out with GraphQL, building a [small page](http://bit.ly/starwars-graphql-nextjs) with these tools. This post is the summary I learned about some performance-tuning techniques, I will detail each of them, after a quick intro to the tools I've used:

 - Quick Introduction to [Next.js](#nextjs), [GraphQL](#graphql) and [Apollo](#apollo)
 - [Paginating lists](#paginating-lists)
 - [Instant navigation from lists to details with lazy loading the data](#list-to-details)
 - [Subtree pagination of a dataset](#subtree-paging)










<a name="nextjs" class="anchor post-intro">

## Next.js & GraphQL & Apollo

First let's have a quick intro on the building blocks: Next.js, GraphQL and the Apollo suite for GraphQL. I promise I'll list some great resources on these later in this post.

### Next.js

{% image_tag "pull-right" "nextjs.svg" "The Next.js logo" %}

[Next.js]() is a framework for server-rendered React apps - it can generate static sites too, but it works great with dynamic sites as well. A powerful Webpack setup, Server-side rendered React and routing packed together to a small framework. If you want to elaborate things and get more dynamic, you can plug it on a web framework like Express, Hapi or Koa, and use their routing, middleware, everything.

It works with React like a charm! Next.js relies on an extra static method on your components called `getInitialProps()`, that you can define to fetch initial data in your props, both for server-side or client side rendered components. This dead-simple pattern is really useful, and simplifies your code you're writing for first render and then the client-rendered pages, as the user navigates in your routing.

As for development experience, it provides a dev mode, where Webpack HMR shines brightly, and shows your updates instantly, or hits you in the face with errors, so you can clearly see that something is wrong. It's build process creates Webpack chunks next to the server-side code, can be deployed easily, even utilizing some CDN for the static assets and chunks.












<a name="graphql" class="anchor">

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










<a name="apollo" class="anchor">

### Apollo

{% image_tag "pull-right" "apollo.svg" "Apollo Platform logo" %}

[Apollo Platform](https://www.apollographql.com/) is a GraphQL toolset that works great with REST APIs as backend resources. They have Server and Client available for free and open source, plus the Apollo Engine, which does caching, tracing and metrics really well - for a price.

**Server & Engine**

The Server takes your Schema and handles the queries and mutations from the clients. To do this, you need to write **resolvers**. These functions will fetch the actual data from wherever you want and the Server will insert them in the Query response accoring to the Schema.

Resolvers can fetch whole resource Types, or even fields within Types. You can build up really complex data structures with resolvers, taking data from API endpoints, DB connections, key-value stores, anything. The client will describe what data it needs in the Query, and the hard work is done by the resolvers and the server.

This means the Server needs two things to max out performance and debuggability:

- caching  
going for a REST API endpoint over and over again for the same data is far from ideal, so caching is really important

Luckily, we can use another feature of the GraphQL language, called _directives_. Using cache directives in the Schema definition, we can tell the server what to cache and for how long - and is it cacheable for everyone (public) or for a certain user session (private).

```graphql

# cache this kind of resource for an hour
type Person@cacheControl(maxAge: 3600) {
    id: ID!
    name: String!
    height: Int
    bio: String

	# cache the image field for a week
    picture: String @cacheControl(maxAge: 10080)

	# add an extra field, which tells if the current user favourited this Person
	# this will be cached for the current user session only
	userFavourite: Boolean! @cacheControl(scope: PRIVATE)
}

```

_**Note:** cache directives are not the part of the GraphQL language. Its done by [Apollo Cache Control](https://github.com/apollographql/apollo-cache-control) which builds upon the **extendibility** of the language, meaning that you can write your own directives!_

- tracing and metrics  
the other important capability of a server is measuring how long it takes to fetch data, and debugging any error that may occur

In the Apollo Platform, these are done by the Apollo Engine. You can hook it up with your server, and it will handle caching, metrics and tracing - the data will be available on their engine dashboard.

**Client + React**

The Apollo Client at it's core, is a great tool for connecting JavaScript to any GraphQL service. There are several sub-libraries, for various frameworks, like React or Vue, each focusing on the best way to integrate GraphQL operations into your application.

Since Next.js is focused on React, I've used the `react-apollo` package in my example implementation. Using it with Next.js, it requires minimal configuration, and a small amount of setup - putting the Apollo Client Provider component in its proper place, and making it work with the `getInitialProps` method of Next.js.

Apollo promotes the usage of the `<Query />` and `<Mutation />` component with your components, but if you like to separate your logic from your components, you can use the plain simple `graphql` HOC, to combine your components.

```jsx

const QUERY_PERSON_LIST = gql`
query PersonList($page: Int = 1) {
	allPersons(page: $page) {
		id
		name
		picture
	}
}
`

// same Query used with the Query Component

export default PersonListing = () => (
	<Query query={QUERY_PERSON_LIST}>
		{({ loading, error, data }) => {
			if (error) return <Error />
			if (loading || !data) return <Loading />

			return <PersonList people={data.allPersons} />
		}}
	</Query>
)

// Used with the graphql method

export default graphql(QUERY_PERSON_LIST, PersonList)

```

I personally prefer the plain `graphql` method, becuse later on when you start to split queries, or create more complex ones, you have the option to separate the component rendering logic from the data fetching.

That's for a quick sumary of Next.js, GraphQL and Apollo, let's move on to some more complex use cases.

I've made a [small app](http://bit.ly/starwars-graphql-nextjs), based on the Star Wars REST API, putting that API behind a GraphQL service, and fetching data from there. The link to the working site and the example code itself is on my [GitHub](https://github.com/necccc/nextjs-apollo-graphql).









## Performance tuning

GraphQL itself is designed to help achieve performant UIs, lets fine tune it a bit even further. I'll dissect three fairly common usecases.

<a name="paginating-lists" class="anchor">

### Lists, pagination

The task is to load a list of items, and implement pagination. Plan is to use the same query but update its parameters for every new page request. So lets get the first page, and render it:

```jsx
export const getStarships = gql`
	query getStarships {
		starshipPages {
			items {
				name
				id
			}
		}
	}
`

const List = (props) => (<div>
	<ul>
		{
			// data structure matches the query
			props.data.starshipPages.items.map( item => (<li key={item.id}>
				{item.name}
			</li>))
		}
	</ul>
</div>)

export default graphql(getStarships)(List)
```

Simple, isn't it? Some details what happens above:

- parse our GraphQL query using `gql`  
this handy tag function for template literals creates graphql query structures from string for the graphql client
- define our query  
fetch the `starshipPages` from the schema, but only two fields from every starship, `name & id`
- make a listing component  
the result from the graphql query will be in the `props`
- compose this component with the `graphql` HOC

The result object from the query has [several handy methods and properties](https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-options), like the loading state, errors or the variables of the latest query - and the actual data, following the structure of the Schema. You can use these methods and properties within your component, but if you want a bit more separation, you can define a map function for the query which allows you to compute new props for your component after the query received results but _before_ rendering.

Let's play with that a bit, and include only the actual _data_ from the query, and the loading state in the props of our listing component:

```jsx
const List = (props) => (<div>
	<ul>
		{
			props.data.map( item => (<li key={item.id}>
				{item.name}
			</li>))
		}
	</ul>
</div>)


export default graphql(getStarships, {
	props: ({data, ownProps}) => {
		// data is the query result object
		// ownProps is the props passed to the Component

		const {
			starshipPages,
			loading
		} = data

		// compute new props, with only the data array, and the loading state
		const newProps = {
			loading,
			data: starshipPages.items
		}

		// do not forget to include the originally received props (ownProps)!
		return Object.assign({}, ownProps, newProps)
	}
})(List)
```

With this, the List component is free of any lexical coupling with the GraphQL Schema, and we will be able to properly re-use it!

Among the methods in the result object, there is one particular, that we will use here, called `fetchMore`. This method is designed to do pagination with GraphQL. It takes a single options object, where you can put the updated _query_, or just the new _parameters_, and a function - that is required - that will handle the result, and update the data you already have.

Let's prepare our code for pagination:
- add the `page` parameter to the query
- set the option `notifyOnNetworkStatusChange` true, so we'll receive updates on loading state automatically
- set the default page to 1
- pass in actual page to props
- implement a function to fetch the next page

```jsx
export const getStarships = gql`
	query getStarships($page: Int = 1) { # expecting 'page' variable
		starshipPages(page: $page) {
			page # current page is returned by the API
			items {
				name
				id
			}
		}
	}
`

const List = (props) => (<div>
	{
		// do something meaningful during loading
		props.loading ? 'LOADING' : ''
	}
	<ul>
		{
			props.data.map( item => (<li key={item.id}>
				{item.name}
			</li>))
		}
	</ul>
	<button onClick={e => props.loadPage(props.page + 1) }>
		Load Page {props.page + 1}
	</button>
</div>)

export default graphql(getStarships, {
	options: {
		// this is needed to auto-update the 'loading' prop
		notifyOnNetworkStatusChange: true,
		variables: { // fill parameters for the query here
			page: 1 // first query will use 1
		},
	},
	props: ({data, ownProps}) => {
		const {
			fetchMore, // grab the fetchMore method
			starshipPages: { items, page },
			loading
		} = data

		const newProps = {
			loading,
			page,
			data: items,
			loadPage: (nextPage) => {
				// use fetchMore on loagPage click
				return fetchMore({
					variables: {
						page: nextPage
					},
					updateQuery: (prev, { variables, fetchMoreResult }) => {
						if (!fetchMoreResult) return prev;
						return Object.assign({}, fetchMoreResult, { variables })
					}
				})
			}
		}

		return Object.assign({}, ownProps, newProps)
	}
})(List)
```

Now let's see what happens, if the user clicks the "Load Page" button:
- `page` is accessed from `props`, incremented and passed to the function
- `loadPage` calls `fetchMore`,
  - with the new page value in `variables`,
  - `updateQuery` to handle results
- the query returns with values
- inside `updateQuery` you can append the results to the ones you already have, or replace them
- returning data from here calls the `props` method on the Query again
- the `props` method calculates new props,
- the component renders with the next page

I've visualized this on a few slides, see them here:

<div class="youtube full"><iframe src="https://www.youtube.com/embed/BbdPPQ094wg?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=0&amp;loop=1&amp;playsinline=1&amp;modestbranding=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="full"></iframe></div>











<a name="list-to-details" class="anchor">

### Navigating from Lists to Details


goals:
navigate to the detail page from the list, w/o page load or waiting and use lazy data fetch
introduction to cache & cache redirects
double query, first with the same query schema as in list
instant render
fetching data, loading
done!



<div class="youtube full"><iframe src="https://www.youtube.com/embed/ZopsOkX_AjI?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=0&amp;loop=1&amp;playsinline=1&amp;modestbranding=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="full"></iframe></div>












<a name="subtree-paging" class="anchor">

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
https://www.youtube.com/watch?v=2It9NofBWYg

[Designing a GraphQL API by Shopify](https://gist.github.com/swalkinshaw/3a33e2d292b60e68fcebe12b62bbb3e2)

apollo server & engine
apollo client with react
next on spectrum.chat
apollo on spectrum.chat