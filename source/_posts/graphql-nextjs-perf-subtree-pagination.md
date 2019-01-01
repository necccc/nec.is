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

Today we're also looking at a detailed view of some resource but

one of the properties is an array of other resources, for example
members of a race or a faction in Star Wars


<a name="bind-operator" class="anchor post-intro">

## Subtree

Great thing about GraphQL types, while they may relate to each other and create complex trees, the entries of types can be stored as a flat, normalized data structure. The caching in Apollo client does exactly this, normalize your data, and provide a unique ID for every entry, whatever the type is. It will try to use any field of ID that looks like `id` or `_id`, so it's helpful to put any unique object ID in there.

If you have a different data schema, you can help the client to get these ID's if you want to, by passing a `dataIdFromObject` function to the Cache instance, but that's optional. See the [module docs on Normalization](https://github.com/apollographql/apollo-client/tree/master/packages/apollo-cache-inmemory#normalization) for further info on this.


## Subtree Pagination

```jsx


// our GraphQL Query,
// get the name and ID of some Starships
export const getStarships = gql`
    query getStarships {
        starshipList {
            items {
                name
                id
            }
        }
    }
`

// a small component to list the data above
const List = (props) => (<div>
    <ul>
        {
            // data structure here matches the data structure in the query
            // using next/link, we're pointing these list items to the starship detail pages
            props.data.starshipList.items.map(item => (<li key={item.id}>
                <Link href={{ pathname: '/starship', query: { id: item.id } }}>
                    <a>{item.name}</a>
                </Link>
            </li>))
        }
    </ul>
</div>)

// compose the component and the GraphQL Query together
// using the `graphql` method from react-apollo.
export default graphql(getStarships)(List)

```


First thing that might occur to you is the Query for the detail page has parameters, and much more fields than the List page. Using the parameter `$id`, the GraphQL server can resolve the correct Starship item and send it back as a Query response. The fields are the details we would like to display on the Details page.

Below the Detail component itself is a static method, called `getInitialProps`. This is one of the best features of Next.js, where we can set up props for the page Component during Server-Side Rendering, or client-side navigation. In this case, we grab the ID from the query parameters, and set in to the props, so later we can use it on the Detail page.

Before creating the composed Component we need a small configuration for the GraphQL client:
 - **notifyOnNetworkStatusChange** set to `true` so we will be notified if teh client starts fetching data on the network
 - **variables** an object, where we pass the parameters for the Query, in our case, the ID

This Detail page works as it is now, but we have to wait for the Query to run, before we can show any data. To make the step from the List page to the Details page instant, we have to redirect part of the Query to the cache.

### Redirect in practice

Simplest solution for this, is to have a separate Query with the same fields as the List had. We're going to do the following:

 - set up a small Query with just the `name` and the `id` - these are the fields queried for the list
 - leave the full Query as it is
 - combine the Query Components together, so when they resolve in order, they will incrementally render the detail page

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

