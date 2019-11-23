import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { MDXProvider } from '@mdx-js/react'
import Layout from '../components/Layout'
import ArticleContent from '../components/ArticleContent'
import ArticleMeta from '../components/ArticleMeta'

import Pic from '../components/Pic'

const components = {
  img: Pic,
}

function PostPageTemplate({ data: { mdx } }) {
  const { relativePath } = mdx.parent
  const { title, date, tags, dateTime, description } = mdx.frontmatter

  return (
    <Layout
      title={title}
      pathName={ `/writing${mdx.fields.slug}` }
      description={ description }
    >
      <ArticleContent>
        <MDXProvider components={components}>
          <MDXRenderer>{mdx.body}</MDXRenderer>
        </MDXProvider>
      </ArticleContent>
      <ArticleMeta
        relativePath={relativePath}
        date={date}
        tags={tags}
        dateTime={dateTime}
      />
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
        description
        date(formatString: "MMMM Do, YYYY")
        dateTime: date
        tags
      }
      id
      body
    }
  }
`
