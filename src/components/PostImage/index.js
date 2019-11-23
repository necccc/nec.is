import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import css from './image.module.scss'

export default ({ image, className = '', align = 'left', alt = '' }) => (
  <StaticQuery
    query={graphql`
      query postImageQuery {
        source: allFile(filter: { sourceInstanceName: { eq: "postimages" } }) {
          edges {
            node {
              extension
              absolutePath
              relativePath
              dir
              publicURL
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    `}
    render={data => {
      const classNames = [css.image]
      classNames.push(css[`image__pull_${align}`])

      return data.source.edges
        .filter(({ node }) => {
          const { relativePath } = node
          return relativePath.includes(image)
        })
        .map(({ node }, i) => (<span className={classNames.join(' ')} key={`${image}-${i}`}>
          { node.childImageSharp && (
             <Img
              className={css.image}
              fluid={node.childImageSharp.fluid}
              alt={alt}
            />
          )}
          { !node.childImageSharp && (
             <img
              className={css.image}
              src={node.publicURL}
              alt={alt}
             />
          )}
          <small className={css.description}>{alt}</small>
        </span>))
    }}
  />
)
