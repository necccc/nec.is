---
title: "Next.js & Apollo GraphQL Performance Tuning: Lists & pagination"
description: "Creating lists and paginating them using data from GraphQL, and relying on React components within Next.js"
date: 2018-09-20
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


In a [previous post](/writing/graphql-with-next-js-and-apollo/) I've introduced Next.js and GraphQL a bit, building a [small site](https://starwars-app-qcusxpjhnl.now.sh/) with data coming from the Star Wars REST API behind a [GraphQL server](https://github.com/necccc/starwars-graphql). After that, it's time to dive into more technical details and check out some common use-cases, where we can benefit from how Next.js and GraphQL work together.

This post is about creating lists and paginating them using data from GraphQL, and relying on React components within Next.js. Heads up, this article might be a bit code-heavy!

<a name="bind-operator" class="anchor post-intro">

## Lists, pagination

The task is to load a list of items, and implement pagination. The plan is to use the same GraphQL Query over and over again, but update its parameters for every new page request. So let's get the first page, and render it:

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
            props.data.starshipList.items.map(item => (<li key={item.id}>
                {item.name}
            </li>))
        }
    </ul>
</div>)

// compose the component and the GraphQL Query together
// using the `graphql` method from react-apollo.
export default graphql(getStarships)(List)
```

Simple, isn't it? Let's see what happens above in details:

- parse our GraphQL query using `gql`  
this handy [tag for template literals](http://exploringjs.com/es6/ch_template-literals.html#_tagged-template-literals) creates graphql query structures from a string for the graphql client
- define our query  
fetch the `starshipList` from the schema, but only two fields from every starship, `name & id`
- make a listing component  
the result from the graphql query will be in the `props.data`
- finally, compose this component with the `graphql` HOC

The result object from the query has [several handy methods and properties](https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-options), like the loading state, errors or the variables of the latest query - and the actual data, following the structure of the Schema, even the Type we've just received. This is a kind of _tight coupling_ between the iterator, that will render the list and the data Schema.

Having connections like this between data and rendering logic should be avoided. The component that renders data can be a shared component, which should not care about the Schema Type (in this case: "starshipList"). On the other side, the Schema might change in the future, and after that, you have to refactor all your components that rely on Schema Types in query results. So let's loosen up that coupling a bit.

You can define a map function for the query which allows you to compute new props for your component after the query received results but _before_ rendering. Play with that a bit, and include only the actual _data_ from the query, and the loading state in the props of our listing component:

```jsx

// our GraphQL Query, unchanged
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

// the listing component
const List = (props) => (<div>
    <ul>
        {
            // NOTE, we're not including the property "starshipList" here
            // just the data, with ids and names
            props.data.map( item => (<li key={item.id}>
                {item.name}
            </li>))
        }
    </ul>
</div>)

// we can use the tools in the Apollo Client to shape our component props
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

Now, the `List` component is free of any reference and coupling with the GraphQL Schema, and we will be able to properly re-use it!

### Pagination

Among the methods in the result object, there is one particular, that we will use here, called `fetchMore`. This method is designed to do pagination with GraphQL. It takes a single options object, where you can put the updated _query_, or just the new _parameters_, and a function (required) - that will handle the result, and update the data you already have.

Let's prepare our code for pagination:
- add the `page` parameter to the query
- set the option `notifyOnNetworkStatusChange` true, so we'll receive updates on loading state automatically
- set the default page to the first page
- pass in the actual page number to props
- implement a function to fetch the next page using `fetchMore`

```jsx

// our updated Query, now expecting a $page variable
// type is Int
// default value is 1
export const getStarships = gql`
    query getStarships($page: Int = 1) {
        starshipList(page: $page) {
            page
            items {
                name
                id
            }
        }
    }
`
// note that the data sctructure now contains the actual page number too

const List = (props) => (<div>
    {
        // do something meaningful during loading, this is just some text
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
        // fill parameters for the query here
        variables: {
            // first query will use 1
            page: 1
        },
    },

    props: ({data, ownProps}) => {
        const {
            // grab the fetchMore method
            fetchMore,
            // actual data
            starshipPages: { items, page },
            // loading state indicator
            loading
        } = data

        const newProps = {
            // pass on loading state & data
            loading,
            page,
            data: items,

            // add a new function to the props,
            // this will fetch the required page
            loadPage: (nextPage) => {
                // use fetchMore
                return fetchMore({
                    variables: {
                        page: nextPage
                    },
                    updateQuery: (prev, { variables, fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;

                        // here you can concatenate the list
                        // with the already loaded and displayed ones (see `prev`)
                        // or just show the next page, like we do here
                        return Object.assign({}, fetchMoreResult, { variables })
                    }
                })
            }
        }

        // return the props
        return Object.assign({}, ownProps, newProps)
    }
})(List)
```

Now let's see what happens if the user clicks the "Load Page" button:
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

<div class="slideshare full">
<iframe src="//www.slideshare.net/slideshow/embed_code/key/3Q0kKB8dLsUc1N" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>
</div>

In a following post I'll show a way to make quick page transitions, from a list of items to a detailed item view, utilizing the goodies in Next.js and the cache in Apollo Client.