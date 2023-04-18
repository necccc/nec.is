import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/Layout'
import ArticleContent from '../../components/ArticleContent'

function Post({ data: { mdx }, children }) {
  const { title, description, slug } = mdx.frontmatter

  return (
    <Layout
      title={title}
      pathName={`/speaking/${slug}`}
      description={description}
    >
      <ArticleContent>{children}</ArticleContent>
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
        date(formatString: "MMMM Do, YYYY")
        tags
        description
      }
    }
  }
`
