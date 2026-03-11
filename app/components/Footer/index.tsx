import css from './footer.module.scss'
import { Logo } from '../Logo'

export const Footer = ({ title = '' }) => (
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
          Check out my <a href="/working">resume</a>
        </li>
      </ul>

      <hr />

      <ul className={css.links}>
        <li>
          <a href="https://github.com/necccc">GitHub</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/szabolcsit">LinkedIn</a>
        </li>
        <li>
          <a href="https://www.instagram.com/_nec">Instagram</a>
        </li>
        <li>
          <a href="https://bsky.app/profile/nec.is">Bluesky</a>
        </li>
        <li>
          <a href="https://mastodon.social/@_Nec">Mastodon</a>
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
        Built using React, React Router v7 and ViteJS, deployed on{' '}
        <a
          href="https://netlify.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Netlify
        </a>
        .
      </p>
    </div>
  </footer>
)
