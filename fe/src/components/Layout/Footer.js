import React from 'react'
import { config } from 'utils'
import { Link } from 'dva/router'
import styles from './Footer.less'

const Footer = () => (<div className={styles.footer}>
  {config.footerText}
  <span className={styles.version}><Link to="/changelog">{`V ${config.version}`}</Link></span>
</div>)

export default Footer
