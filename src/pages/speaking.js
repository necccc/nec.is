import React from 'react'
import { graphql } from 'gatsby'
import { Link } from 'gatsby'

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
      <ul className={css.talk_list}>
        {getTalks(props.data).map(
          ({ node: { id, parent, fields, frontmatter } }) => (
            <li key={id} className={css.talk_item}>
              <h3>
                <Link to={`/${parent.sourceInstanceName}/${frontmatter.slug}`}>
                  <span className={css.talk_item_title}>
                    {frontmatter.title}
                  </span>
                  <span className={css.talk_item_year}>{frontmatter.year}</span>
                </Link>
              </h3>

              <p>
                <strong className={css.talk_item_topic}>
                  {frontmatter.topic}
                </strong>
                <small className={css.talk_item_date}>{frontmatter.date}</small>
              </p>

              <p>{frontmatter.description}</p>
            </li>
          )
        )}
      </ul>
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
