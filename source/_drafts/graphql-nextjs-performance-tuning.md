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

Our task here, is to navigate from a listing page to a detail page as seamless as possible. We assume, that we have some data already for the detail page, since the item we're about to view in more detail was already shown in a list.

This is partially true
//introduction to cache & cache redirects


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