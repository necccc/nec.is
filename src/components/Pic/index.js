import React from 'react'
import styles from './pic.module.scss'

const Pic = props => {
  const { alt, src, title } = props
  const classNames = [styles.image]

  classNames.push(styles[`image__pull_${title}`])

  return (
    <span className={classNames.join(' ')}>
      <img src={src} alt={alt} />
      <small className={styles.description}>{alt}</small>
    </span>
  )
}

export default Pic
