import React from 'react'
import { graphql } from 'gatsby'
import { Link } from 'gatsby'

import Layout from '../components/Layout'
import styles from './index.module.scss'

const getPosts = data => {
  return data.allMdx.edges.filter(
    ({
      node: {
        parent: { sourceInstanceName },
      },
    }) => sourceInstanceName === 'writing'
  )
}

export default props => (
  <Layout title="Hi, I'm Szabolcs!">
    <section className={styles.intro}>
      <p>
        Mostly online as <a href="https://twitter.com/_Nec">_Nec</a>, I'm a
        developer from Budapest, Hungary. Organizer and curator of{' '}
        <a href="http://jsconfbp.com/">JSConf Budapest</a> and{' '}
        <a href="http://cssconfbp.rocks/">CSSConf Budapest</a>, organizer of{' '}
        <a href="https://www.meetup.com/Frontend-Meetup-Budapest/">
          Frontend Meetup Budapest
        </a>{' '}
        occasional <a href="/speaking">speaker</a>, hobby hardware hacker,
        photographer and Lego nerd. Senior engineer at{' '}
        <a href="https://cloud.ibm.com/">IBM Cloud</a>.
      </p>
    </section>

    <section className={styles.articles}>
      <ul className={styles.article_grid}>
        {getPosts(props.data).map(({ node }) => (
          <li key={node.id} className={styles.article_grid_item}>
            <h3>
              <Link
                to={`/${node.parent.sourceInstanceName}${node.fields.slug}`}
              >
                {node.frontmatter.title}
              </Link>
            </h3>
            <p>{node.frontmatter.description}</p>

            <p>
              <small className={styles.article_meta}>
                Posted on{' '}
                <span className={styles.article_meta_date}>
                  {node.frontmatter.postdate}
                </span>
                <span className={styles.article_meta_timetoread}>
                  {node.timeToRead} min read
                </span>
                <Link
                  to={`/${node.parent.sourceInstanceName}${node.fields.slug}`}
                >
                  Read more...
                </Link>
              </small>
            </p>
          </li>
        ))}
      </ul>
    </section>
  </Layout>
)

export const query = graphql`
  query IndexQuery {
    allMdx(sort: {order: DESC, fields: frontmatter___date}, filter: {frontmatter: {draft: {ne: true}}}) {
      edges {
        node {
          id
          timeToRead
          fields {
            slug
          }
          frontmatter {
            title
            date
            postdate: date(formatString: "MMMM Do")
            description
            draft
          }
          parent {
            ... on File {
              sourceInstanceName
            }
          }
        }
      }
    }
  }
`
