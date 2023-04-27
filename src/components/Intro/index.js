import React from 'react'

import * as css from './intro.module.scss'

const Intro = ({ children }) => <span className={css.intro}>{children}</span>

export default Intro
