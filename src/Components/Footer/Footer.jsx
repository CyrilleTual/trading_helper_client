import BtnLink from '../UI/BtnLink'
import styles from './footer.module.css'


function Footer() {
  return (
    <footer className={styles.myfooter}>
    <BtnLink link="/legal" title="mentions légales" /> {"       "}
    <BtnLink link="/credits" title="crédits" />
    </footer>
  )
}

export default Footer

