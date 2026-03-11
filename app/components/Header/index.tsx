import classnames from 'classnames'

import { useEffect, useState } from 'react'

import css from './header.module.scss'
import { Logo } from '../Logo'
import { Link } from 'react-router'

export const Header = ({ title = '', resume = false }) => {
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
  }, [scrollSetSmall])

  return (
    <header
      className={classnames(
        css.header,
        resume && css.header_resume,
        small && css.header_small
      )}
    >
      <div className={css.header_top} smallTitle={title}>
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
          <label htmlFor="menu-open">
            <span>menu</span>
          </label>

          {!resume && (
            <ul className={css.header_nav_links}>
              <li className={css.header_nav_link}>
                <Link className={css.link} to="/working">
                  working
                </Link>
              </li>
              {/*               <li className={css.header_nav_link}>
                <Link className={css.link} to="/speaking">
                  speaking
                </Link>
              </li> */}
              <li className={css.header_nav_link}>
                <a className={css.link} href="https://bsky.app/profile/nec.is">
                  social
                </a>
              </li>
            </ul>
          )}

          {resume && (
            <ul className={css.header_nav_links}>
              <li className={css.header_nav_link}>
                <a href="#skills" className={css.link}>
                  skills
                </a>
              </li>
              <li className={css.header_nav_link}>
                <a href="#work" className={css.link}>
                  work
                </a>
              </li>
              <li className={css.header_nav_link}>
                <a href="#community" className={css.link}>
                  community
                </a>
              </li>
              <li className={css.header_nav_link}>
                <a href="#speaking" className={css.link}>
                  speaking
                </a>
              </li>
              <li className={css.header_nav_link}>
                <a href="#education" className={css.link}>
                  education
                </a>
              </li>
            </ul>
          )}
        </nav>
      </div>
      <h1 className={css.header_title}>{title}</h1>
    </header>
  )
}
