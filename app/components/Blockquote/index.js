import classnames from 'classnames'
import React from 'react'

import * as css from './blockquote.module.scss'

const Blockquote = ({ children, by, link, linkText, align = 'full' }) => (
  <blockquote className={classnames(css.quote, css[`quote-${align}`])}>
    <p className={css.body}>{children}</p>
    <footer className={css.footer}>
      <strong className={css.by}>{by}</strong>
      {linkText ? (
        <cite className={css.cite}>
          <a href={link}>{linkText}</a>
        </cite>
      ) : (
        ''
      )}
    </footer>
  </blockquote>
)

export default Blockquote
