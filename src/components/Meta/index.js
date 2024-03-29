import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import { Helmet } from 'react-helmet'

const SiteMetadata = ({ pathName }) => {
  const query = graphql`
    query MetaQuery {
      site {
        siteMetadata {
          siteUrl
          title
          description
        }
      }
    }
  `
  const {
    site: {
      siteMetadata: { siteUrl, title, description, twitter },
    },
  } = useStaticQuery(query)

  return (
    <Helmet defer={false} defaultTitle={title} titleTemplate={`%s | ${title}`}>
      <html lang="en" />

      <link rel="canonical" href={`${siteUrl}${pathName}`} />
      <meta name="description" content={description} />
      <meta name="docsearch:version" content="2.0" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover"
      />
      <link rel="me" href="https://mastodon.social/@_Nec" />
      {/*
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en" />
      <meta property="og:site_name" content={title} />
      <meta property="og:image" content={`${siteUrl}${gatsbyIcon}`} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
 */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={twitter} />
    </Helmet>
  )
}

export default SiteMetadata
