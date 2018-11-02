---
title: "Next.js & Apollo GraphQL Performance Tuning: From Lists to Details"
description: "Navigate from a listing page to a detail page as fast and seamless as possible."
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


In some previous posts I've [introduced](/writing/graphql-with-next-js-and-apollo/) Next.js and GraphQL a bit, and showed some tips on [creating and paginating lists](/writing/next-js-apollo-graphql-performance-tuning-lists-pagination/) using these tools.

Our task today, is to navigate from a listing page to a detail page as fast and seamless as possible. We assume, that we have some data already for the detail page (like the name or a thumbnail), since the item we're about to view in more detail was already shown in a list.

<a name="bind-operator" class="anchor post-intro">

## Navigating from Lists to Details

Great thing about GraphQL types, while they may relate to each other and create complex trees, the entries of types can be stored as a flat, normalized data structure. The caching in Apollo client does exactly this, normalize your data, and provide a unique ID for every entry, whatever the type is. It will try to use any field of ID that looks like `id` or `_id`, so it's helpful to put any unique object ID in there.

If you have a different data schema, you can help the client to get these ID's if you want to, by passing a `dataIdFromObject` function to the Cache instance, but that's optional. See the [module docs on Normalization](https://github.com/apollographql/apollo-client/tree/master/packages/apollo-cache-inmemory#normalization) for further info on this.


### CacheRedirects

Now the exciting part! By finding entities in the cache by unique ID's and Type, we can redirect Queries to the cache and have them resolve immediately. Something like this, step-by-step:

1. we start a Query
2. the cacheRedirect tries to map the Query data in the cache
3. if successful, it resolves the Query without touching the network

If the data is missing from the cache, the Query will run through the network, and works as usual.

The tricky part here, is that the fields of the redirected Query should be in the cache. You can't require a field from there that's not cached already - if this happens, the Query will miss cache and hit the network.

### The Detail page

Lets get specific: here's the list of Starships, from the previous post, with a minor addition. Using `next/link` we're going to link the list item to the detail page of the same item:

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

So far so good, let's create a detail page for our data, listing a bunch of details of a Starship. First, this will be a regular page, with its own GraphQL Query for the data.

```jsx
import { graphql } from 'react-apollo'

// requesting the data from graphql, by the ID
export const getStarship = gql`
    query getStarship($id: ID) {
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

// compose the component and the GraphQL Query together
// using the `graphql` method from react-apollo.
export default graphql(getStarship, queryParams)(Detail)
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

### Optimized Server-side rendering

Problem with this solution, that on first render it runs two queries, in series one after the another.
To resolve that we can put a check if we are doing server-side rendering, or client side navigation - Next.js can help with this.

Even better solution, checking the cache if there is enough data in it, to start the incremental rendering of the Detail page! We can check the local GraphQL cache in the client, if there is enough data for a detail page, by using the `readQuery` or the `readFragment` methods - see the [detailed documentation on these](https://www.apollographql.com/docs/react/advanced/caching.html#direct).

I've tried to explain all this on a few slides, see them here:

<div class="slideshare full">
<iframe src="//www.slideshare.net/slideshow/embed_code/key/Lrf0vMRGlnPb9u" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>
</div>

In a following post I'll