import React from 'react'
import styles from './layout.module.scss'
import Footer from '../Footer'
import Header from '../Header'

const Layout = ({ title = '', resume = false, children }) => (
  <main className={styles.layout}>
    <Header title={title} resume={ resume } />
      {children}
    <Footer />
  </main>
)

export default Layout
