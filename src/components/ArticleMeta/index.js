import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import styles from './articlemeta.module.scss'

const Tags = ({ tags }) =>
  tags.map((tag, i, tags) => {
    const lastBeforeOne = i === tags.length - 2
    const last = i === tags.length - 1
    let glue = ','

    if (lastBeforeOne) glue = ' and'
    if (last) glue = ''

    return (
      <>
        <a className="article-tag-link" href="/tags/async/" key={`tag-${tag}`}>
          {tag}
        </a>
        {glue}{' '}
      </>
    )
  })

const ArticleMeta = ({ relativePath = '', date, tags, dateTime }) => (
  <StaticQuery
    query={graphql`
      query ArticleMetaQuery {
        site {
          siteMetadata {
            twitterUrl
            email
          }
        }
      }
    `}
    render={({ site: { siteMetadata } }) => (
      <section className={styles.meta}>
        <div className={styles.meta_inner}>
          <p>
            Posted on <time dateTime={dateTime}>{date}</time>.
          </p>
          <p>
            If you wish to comment, correct someting silly I've wrote or ask a
            question, the{' '}
            <a
              href={`https://github.com/necccc/nec.is/tree/live/content/writing/${relativePath}`}
            >
              source for this post is on github
            </a>
            , contact me there, or via{' '}
            <a href={`mailto:${siteMetadata.email}`} title="email">
              email
            </a>
            , or find me on <a href={siteMetadata.twitterUrl}>twitter</a>.
          </p>
        </div>
      </section>
    )}
  />
)

export default ArticleMeta
