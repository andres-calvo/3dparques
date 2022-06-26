import useStore from '@/helpers/store'
import { useEffect, useRef } from 'react'
import styles from './dom.module.scss'
const Dom = ({ children }) => {
  const ref = useRef(null)
  useEffect(() => {
    useStore.setState({ dom: ref })
  }, [])

  return (
    <div ref={ref} className={styles.dom}>
      {children}
    </div>
  )
}

export default Dom
