import React from 'react'
import { Helmet } from 'react-helmet'

import Footer from '../Footer'
import Header from '../Header'
import Meta from '../Meta'
import * as css from './layout.module.scss'

const Layout = ({
  title = '',
  resume = false,
  skipMetaTitle = false,
  children,
  pathName,
  description,
}) => (
  <>
    <Meta pathName={pathName} description={description} skipMetaTitle />
    <Helmet>
      {!skipMetaTitle && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
    </Helmet>
    <main className={css.layout}>
      <Header title={title} resume={resume} />
      {children}
      <Footer />
    </main>
  </>
)

export default Layout
