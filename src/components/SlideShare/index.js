import React from 'react'
import classnames from 'classnames'
import * as css from './slideshare.module.scss'

export default ({ src, className = '' }) => (
  <div className={classnames(css.embed, className)}>
    <iframe
      src={src}
      frameborder="0"
      marginwidth="0"
      marginheight="0"
      scrolling="no"
      allowfullscreen
    ></iframe>
  </div>
)
