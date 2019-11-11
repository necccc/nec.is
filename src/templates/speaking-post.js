import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../components/Layout'
import ArticleContent from '../components/ArticleContent'
import ArticleMeta from '../components/ArticleMeta'

import Pic from '../components/Pic'

const components = {
  img: Pic,
  image: Pic,
}

function PostPageTemplate({ data: { mdx } }) {
  const { title } = mdx.frontmatter

  return (
    <Layout title={title}>
      <ArticleContent>
        <MDXRenderer components={components}>{mdx.body}</MDXRenderer>
      </ArticleContent>
    </Layout>
  )
}

export default PostPageTemplate

export const pageQuery = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      parent {
        ... on File {
          relativePath
        }
      }
      frontmatter {
        title
        date(formatString: "MMMM Do, YYYY")
        tags
      }
      id
      body
    }
  }
`
