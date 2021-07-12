import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import * as css from './video.module.scss'

export default ({ video, className = '', align = 'full', alt = '' }) => (
  <StaticQuery
    query={graphql`
      query postVideoQuery {
        source: allFile(filter: { sourceInstanceName: { eq: "postvideos" } }) {
          edges {
            node {
              extension
              absolutePath
              relativePath
              dir
              publicURL
            }
          }
        }
      }
    `}
    render={data => {
      const classNames = [css.video]
      classNames.push(css[`video__${align}`])

      return data.source.edges
        .filter(({ node }) => {
          const { relativePath } = node
          return relativePath.includes(video)
        })
        .map(({ node }, i) => (<div className={classNames.join(' ')} key={`${video}-${i}`}>
          <video
            src={node.publicURL}
            controls={ false }
            autoPlay
            loop={ true }
            muted={ true }
            playsInline={ true }
            title={ alt }>
          </video>
          <small className={css.description}>{alt}</small>
        </div>))
    }}
  />
)
