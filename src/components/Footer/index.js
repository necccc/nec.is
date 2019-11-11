import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Logo from '../Logo'
import styles from './footer.module.scss'

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
      <footer className={styles.footer}>
        <div className={styles.footer_content}>
          <h3 className={styles.farewell}>
            Keep updated, contact, get in touch!
          </h3>

          <ul className={styles.about}>
            <li>
              Contact me via{' '}
              <a href="mailto:nec@shell8.net" title="email">
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

          <ul className={styles.links}>
            <li>
              <a href="/working" />
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

        <div className={styles.footer_bottom}>
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
