import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../components/Layout'
import ArticleContent from '../components/ArticleContent'

function PostPageTemplate({ data: { mdx } }) {
  const { title, description } = mdx.frontmatter

  return (
    <Layout
      title={title}
      pathName={ `/speaking${mdx.fields.slug}` }
      description={ description }
    >
      <ArticleContent>
        <MDXRenderer>{mdx.body}</MDXRenderer>
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
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "MMMM Do, YYYY")
        tags,
        description
      }
      id
      body
    }
  }
`
