import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import classnames from 'classnames'
import Logo from '../Logo'
import styles from './header.module.scss'

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
      className={ classnames(styles.header, resume && styles.headerResume, small && styles.header__small) }
    >
      <div className={styles.header_top} smallTitle={title}>
        <h1 className={styles.header_home} title="_Nec">
          <Link to="/" title="Go to the home page">
            <Logo />
            <span className={styles.header_home_text}>_Nec</span>
          </Link>
        </h1>

        <nav className={styles.header_nav}>
          <input
            className={styles.header_nav_opener_input}
            type="checkbox"
            id="menu-open"
          />
          <label htmlFor="menu-open" className={styles.header_nav_opener}>
            <span>menu</span>
          </label>

          <ul className={styles.header_nav_links}>
            <li className={styles.header_nav_link}>
              <Link to="/">writing</Link>
            </li>
            <li className={styles.header_nav_link}>
              <Link to="/speaking">speaking</Link>
            </li>
            <li className={styles.header_nav_link}>
              <a href="https://twitter.com/_Nec">twitter</a>
            </li>
          </ul>
        </nav>
      </div>
      <h1 className={styles.header_title}>{title}</h1>
    </header>
  )
}
