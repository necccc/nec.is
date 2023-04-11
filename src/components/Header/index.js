import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import classnames from 'classnames'
import Logo from '../Logo'
import * as css from './header.module.scss'

export default ({ title = '', resume }) => {
  const [small, setSmall] = useState(false)
  const treshold = resume ? 200 : 92

  const scrollSetSmall = () => {
    if (window.scrollY >= treshold) {
      setSmall(true)
    } else if (window.scrollY < treshold) {
      setSmall(false)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.document.addEventListener('scroll', scrollSetSmall)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.document.removeEventListener('scroll', scrollSetSmall)
      }
    }
  }, [false])

  return (
    <header
      className={classnames(
        css.header,
        resume && css.headerResume,
        small && css.header__small
      )}
    >
      <div className={css.header_top} smalltitle={title}>
        <h1 className={css.header_home} title="_Nec">
          <Link to="/" title="Go to the home page">
            <Logo />
            <span className={css.header_home_text}>_Nec</span>
          </Link>
        </h1>

        <nav className={css.header_nav}>
          <input
            className={css.header_nav_opener_input}
            type="checkbox"
            id="menu-open"
          />
          <label htmlFor="menu-open" className={css.header_nav_opener}>
            <span>menu</span>
          </label>

          <ul className={css.header_nav_links}>
            <li className={css.header_nav_link}>
              <Link to="/">writing</Link>
            </li>
            <li className={css.header_nav_link}>
              <Link to="/speaking">speaking</Link>
            </li>
            <li className={css.header_nav_link}>
              <a href="https://twitter.com/_Nec">twitter</a>
            </li>
          </ul>
        </nav>
      </div>
      <h1 className={css.header_title}>{title}</h1>
    </header>
  )
}
