import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/Layout'
import ArticleContent from '../../components/ArticleContent'
import ArticleMeta from '../../components/ArticleMeta'

function Post({ data: { mdx }, children }) {
  const { title, date, tags, dateTime, description, slug } = mdx.frontmatter

  return (
    <Layout
      title={title}
      pathName={`/writing/${slug}`}
      description={description}
    >
      <ArticleContent>{children}</ArticleContent>
      <ArticleMeta
        relativePath={slug}
        date={date}
        tags={tags}
        dateTime={dateTime}
      />
    </Layout>
  )
}

export default Post

export const query = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        slug
        title
        description
        date(formatString: "MMMM Do, YYYY")
        dateTime: date
        tags
      }
    }
  }
`
