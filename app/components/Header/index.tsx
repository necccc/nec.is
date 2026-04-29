import classnames from 'classnames'

import { useEffect, useState } from 'react'

import css from './header.module.scss'
import { Logo } from '../Logo'
import { Link } from 'react-router'

type Props = {
  title: string
  subTitle?: string
  resume?: boolean
}

export const Header = ({ title = '', resume = false, subTitle }: Props) => {
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
      <div className={css.header_top} small-title={title}>
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

          <ul className={css.header_nav_links}>
            <li className={css.header_nav_link}>
              <Link to="/working#work" preventScrollReset className={css.link}>
                work
              </Link>
            </li>
            <li className={css.header_nav_link}>
              <Link
                to="/working#case-studies"
                preventScrollReset
                className={css.link}
              >
                case studies
              </Link>
            </li>
            <li className={css.header_nav_link}>
              <Link
                to="/working#skills"
                preventScrollReset
                className={css.link}
              >
                skills
              </Link>
            </li>
            <li className={css.header_nav_link}>
              <Link
                to="/working#speaking"
                preventScrollReset
                className={css.link}
              >
                speaking
              </Link>
            </li>
            <li className={css.header_nav_link}>
              <Link
                to="/working#community"
                preventScrollReset
                className={css.link}
              >
                community
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <h1
        className={classnames(
          css.header_title,
          subTitle && css.header_with_subtitle
        )}
      >
        {title}
      </h1>
      {subTitle && (
        <h3 className={css.header_subtitle}>
          <span>{subTitle}</span>
        </h3>
      )}
      {resume && (
        <span className={css.header_contact}>
          hello@nec.is <br />
          +47 90 12 05 40
        </span>
      )}
    </header>
  )
}
