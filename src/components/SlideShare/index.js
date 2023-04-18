import React from 'react'
import classnames from 'classnames'
import * as css from './slideshare.module.scss'

const SlideShare = ({
  src,
  className = '',
  title = 'SlideShare presentation',
}) => (
  <div className={classnames(css.embed, className)}>
    <iframe
      src={src}
      frameborder="0"
      marginwidth="0"
      marginheight="0"
      scrolling="no"
      title={title}
      allowfullscreen
    ></iframe>
  </div>
)

export default SlideShare
