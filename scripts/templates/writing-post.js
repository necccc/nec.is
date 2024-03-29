import React from 'react'
import { graphql } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import Layout from '../../src/components/Layout'
import ArticleContent from '../../src/components/ArticleContent'
import ArticleMeta from '../../src/components/ArticleMeta'

import Pic from '../../src/components/Pic'

const components = {
  img: Pic,
}

function PostPageTemplate({ data: { mdx }, children }) {
  const { relativePath } = mdx.parent
  const { title, date, tags, dateTime, description } = mdx.frontmatter

  console.log(mdx)

  return (
    <Layout
      title={title}
      pathName={`/writing/${mdx.fields.slug}`}
      description={description}
    >
      <ArticleContent>
        <MDXProvider components={components}>{children}</MDXProvider>
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
  query ($id: String!) {
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
    }
  }
`
