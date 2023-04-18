import React from 'react'
import classnames from 'classnames'
import * as css from './youtube.module.scss'

const YouTube = ({ src, className = '', title = 'Youtube video player' }) => (
  <div className={classnames(css.embed, className)}>
    <iframe
      src={src}
      frameborder="0"
      gesture="media"
      frameBorder="0"
      title={title}
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
)

export default YouTube
