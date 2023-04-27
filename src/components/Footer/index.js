import { StaticQuery, graphql } from 'gatsby'
import React from 'react'

import Logo from '../Logo'
import * as css from './footer.module.scss'

const Footer = ({ title = '' }) => (
  <StaticQuery
    query={graphql`
      query FooterQuery {
        site {
          siteMetadata {
            instagramUrl
            linkedinUrl
            githubUrl
            twitterUrl
            email
          }
        }
      }
    `}
    render={({ site: { siteMetadata } }) => (
      <footer className={css.footer}>
        <div className={css.footer_content}>
          <h3 className={css.farewell}>Keep updated, contact, get in touch!</h3>

          <ul className={css.about}>
            <li>
              Contact me via{' '}
              <a href="mailto:hello@nec.is" title="email">
                email
              </a>
            </li>
            <li>
              <a href="/rss.xml">RSS feed</a> of my posts
            </li>
            <li>
              Check out my <a href="/working">resume</a>
            </li>
          </ul>

          <hr />

          <ul className={css.links}>
            <li>
              <a href={siteMetadata.githubUrl}>GitHub</a>
            </li>
            <li>
              <a href={siteMetadata.instagramUrl}>Instagram</a>
            </li>
            <li>
              <a href={siteMetadata.twitterUrl}>Twitter</a>
            </li>
            <li>
              <a href={siteMetadata.linkedinUrl}>LinkedIn</a>
            </li>
          </ul>
        </div>

        <div className={css.footer_bottom}>
          <Logo />
          <p>
            {new Date().getFullYear()} © Szabolcs Szabolcsi-Toth. All rights
            reserved.
          </p>
          <p>
            Built using{' '}
            <a
              href="https://www.gatsbyjs.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GatsbyJS
            </a>
            , deployed on{' '}
            <a
              href="https://netlify.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netlify
            </a>
            .
            {/* <br />
            if you're interested how,{' '}
            <a href="/writing/how-this-site-was-made/">
              I've wrote a post about it here!
            </a> */}
          </p>
        </div>
      </footer>
    )}
  />
)

export default Footer
