import { graphql } from 'gatsby'
import { Link } from 'gatsby'
import React from 'react'

import Layout from '../components/Layout'
import * as css from './speaking.module.scss'

const getTalks = (data) => {
  return data.allMdx.edges.filter(
    ({
      node: {
        parent: { sourceInstanceName },
      },
    }) => sourceInstanceName === 'speaking'
  )
}

const Speaking = (props) => (
  <Layout title="Speaking" pathName="/">
    <section className={css.talks}>

        {getTalks(props.data).map(
          ({ node: { id, parent, fields, frontmatter } }) => (
            <article key={id} className={css.talk_item}>
              <h3 className={css.talk_item_title}>
                <Link to={`/${parent.sourceInstanceName}/${frontmatter.slug}`}>
                  <span >
                    {frontmatter.title}
                  </span>
                </Link>
              </h3>

              <p className={css.talk_item_meta}>
                <strong className={css.talk_item_topic}>
                  {frontmatter.topic}
                </strong>
                <small className={css.talk_item_date}>{frontmatter.date}</small>
              </p>

              <p className={css.talk_content}>{frontmatter.description}</p>
            </article>
          )
        )}
    </section>
  </Layout>
)

export default Speaking

export const query = graphql`
  query SpeakingQuery {
    allMdx {
      edges {
        node {
          id
          parent {
            ... on File {
              name
              sourceInstanceName
            }
          }
          frontmatter {
            slug
            title
            year: event_start(formatString: "YYYY")
            date: event_start(formatString: "MMMM Do, YYYY")
            topic
            description
            url
          }
        }
      }
    }
  }
`
