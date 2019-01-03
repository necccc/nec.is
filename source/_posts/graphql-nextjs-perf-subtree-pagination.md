---
title: "Next.js & Apollo GraphQL Performance Tuning: Subtree Pagination"
description: "Paginate items related to a parent resource type, for example the members of a faction in Star Wars"
date: 2018-10-20
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


In some previous posts I've [introduced](/writing/graphql-with-next-js-and-apollo/) Next.js and GraphQL a bit, and showed some tips on [creating and paginating lists](/writing/next-js-apollo-graphql-performance-tuning-lists-pagination/), and then quickly explained how to [load detailed data from lists, looking as instant as possible, using cache](/writing/next-js-apollo-graphql-performance-tuning-from-lists-to-details/).

In this post we're still looking at a detailed view of some resource, but lets say one of the properties is an array of other resources, for example members of a race or a faction in Star Wars!

<a name="bind-operator" class="anchor post-intro">




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





## Subtree

We would not query every member of the Rebel Alliance for this page, only the first ten maybe, and let the user browse or search in them. Displaying so much people on a single page wouldn't be just weird UX, but resolving all those data might take several seconds for our GraphQL server.

In classical REST such lists are just URLs, pointing each to the listed resource items - so if we would like to resolve a property in GraphQL, that is a list of a 100 items, that would mean a 100 new query for our resolvers on the GraphQL server.

Instead, in our Schema we can tell the GraphQL server to resolve the first 6 or 10 only, and use some paging parameters to resolve more items later.

This looks something like this


## Subtree Pagination







```jsx
import { compose, graphql } from 'react-apollo'

// requesting the same fields as they were in the list
// specific to the ID we want to see in details
export const getStarshipQuick = gql`
    query getStarshipQuick($id: ID) {
        Starship(id: $id) {
            items {
                id
                name
            }
        }
    }
`

// requesting the full data from graphql, by the ID
export const getStarshipFull = gql`
    query getStarshipFull($id: ID) {
        Starship(id: $id) {
            items {
                id
                name
                model
                length
                crew
                manufacturer
            }
        }
    }
`

class Starship extends React.Component {
    render() {
        const { starship } = this.props.data

        return (<div>
            <h1>{starship.name}</h1>

            <img src="{starship.picture}" />

            <ul>
                <li>Model: {starship.model}</li>
                <li>Length: {starship.length}</li>
                <li>Crew: {starship.crew}</li>
                <li>Manufacturer: {starship.manufacturer}</li>
            </ul>
        </div>)
    }
}

// the getInitialProps of nextjs prepares the Starship ID for us
// grabbing it from the query
Detail.getInitialProps = async function ({ query }) {
	return {
		id: query.id
	}
}

// we set up two things here:
// - get notified if the GraphQL Query is in loading state
// - put the ID from the props, to the variables, so the Query receives it
const queryParams = {
	options: props => {
		return {
			notifyOnNetworkStatusChange: true,
			variables: {
				id: props.id
			},
		}
	}
}

// here we compose two GraphQL queries together
// they will run in order as we compose them
// first the Quick one - which will be redirected to the cache, and render instantly
// then the Full one - after resolving that one from the network,
// it will render the rest of the details
export default compose(
	graphql(getStarshipQuick, queryParams),
	graphql(getStarshipFull, queryParams)
)(Detail)
```

I've tried to explain all this on a few slides, see them here:

<div class="slideshare full">
<iframe src="//www.slideshare.net/slideshow/embed_code/key/Lrf0vMRGlnPb9u" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>
</div>

