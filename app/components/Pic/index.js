import React from 'react'

import * as css from './pic.module.scss'

const Pic = (props) => {
  const { alt, src, title } = props
  const classNames = [css.image]

  classNames.push(css[`image__pull_${title}`])

  return (
    <span className={classNames.join(' ')}>
      <img src={src} alt={alt} />
      <small className={css.description}>{alt}</small>
    </span>
  )
}

export default Pic
