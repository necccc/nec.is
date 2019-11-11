const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return graphql(
    `
      {
        allMdx {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                title
              }
              parent {
                ... on File {
                  name
                  relativePath
                  sourceInstanceName
                }
              }
              body
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      console.log(result.errors);
      throw result.errors;
    }

    const posts = result.data.allMdx.edges.filter((post) => {
      return post.node.parent.sourceInstanceName === 'writing'
    })

    const talks = result.data.allMdx.edges.filter((post) => {
      return post.node.parent.sourceInstanceName === 'speaking'
    })

    // Create blog posts pages.
    posts.forEach(({ node }, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node
      const slug = node.fields.slug

      createPage({
        path: `/${node.parent.sourceInstanceName}${slug}`,
        component: path.resolve("./src/templates/writing-post.js"),
        context: {
          id: node.id,
          slug,
          previous,
          next,
        }
      })
    })

    talks.forEach(({ node }, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node
      const slug = node.fields.slug

      createPage({
        path: `/${node.parent.sourceInstanceName}${slug}`,
        component: path.resolve("./src/templates/speaking-post.js"),
        context: {
          id: node.id,
          slug,
          previous,
          next,
        }
      })
    })


    // instagram data https://developers.facebook.com/docs/instagram-api/reference/media


  })
}


exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
