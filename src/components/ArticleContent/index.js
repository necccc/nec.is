import React from 'react'
import styles from './article.module.scss'

const ArticleContent = ({ children }) => (
  <article className={styles.article}>{children}</article>
)

export default ArticleContent
