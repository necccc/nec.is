import React from 'react'
import { graphql } from 'gatsby'
import { Link } from 'gatsby'

import Layout from '../components/Layout'
import styles from './speaking.module.scss'

const getTalks = data => {
  return data.allMdx.edges.filter(
    ({
      node: {
        parent: { sourceInstanceName },
      },
    }) => sourceInstanceName === 'speaking'
  )
}

export default props => (
  <Layout
    title="Speaking"
    pathName="/"
  >
    <section className={styles.talks}>
      <ul className={styles.talk_list}>
        {getTalks(props.data).map(
          ({ node: { id, parent, fields, frontmatter } }) => (
            <li key={id} className={styles.talk_item}>
              <h3>
                <Link to={`/${parent.sourceInstanceName}/${fields.slug}`}>
                  <span className={styles.talk_item_title}>
                    {frontmatter.title}
                  </span>
                  <span className={styles.talk_item_year}>
                    {frontmatter.year}
                  </span>
                </Link>
              </h3>

              <p>
                <strong className={styles.talk_item_topic}>
                  {frontmatter.topic}
                </strong>
                <small className={styles.talk_item_date}>
                  {frontmatter.date}
                </small>
              </p>

              <p>{frontmatter.description}</p>
            </li>
          )
        )}
      </ul>
    </section>
  </Layout>
)

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
          fields {
            slug
          }
          timeToRead
          frontmatter {
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
