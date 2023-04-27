import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import React from 'react'

import * as css from './image.module.scss'

const PostImage = ({ image, className = '', align = 'left', alt = '' }) => {
  const data = useStaticQuery(graphql`
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
              gatsbyImageData(width: 800)
            }
          }
        }
      }
    }
  `)
  const classNames = [css.image]
  classNames.push(css[`image__pull_${align}`])

  return data.source.edges
    .filter(({ node }) => {
      const { relativePath } = node
      return relativePath.includes(image)
    })
    .map(({ node }, i) => (
      <span className={classNames.join(' ')} key={`${image}-${i}`}>
        {node.childImageSharp && (
          <GatsbyImage
            className={css.image}
            fluid={node.childImageSharp.fluid}
            alt={alt}
          />
        )}
        {!node.childImageSharp && (
          <img className={css.image} src={node.publicURL} alt={alt} />
        )}
        <small className={css.description}>{alt}</small>
      </span>
    ))
}

export default PostImage
