import React from 'react'

import * as css from './article.module.scss'

const ArticleContent = ({ children }) => (
  <article className={css.article}>{children}</article>
)

export default ArticleContent
