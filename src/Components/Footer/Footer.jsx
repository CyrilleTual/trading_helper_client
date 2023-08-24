import BtnLink from '../UI/BtnLink'
import styles from './footer.module.css'


function Footer() {
  return (
    <footer className={`site-footer ${styles.myfooter}`}>
      <BtnLink link="/legal" title="mentions légales" name="mentions légales"/> {"       "}
      <BtnLink link="/credits" title="crédits" name="crédits"/>
    </footer>
  );
}

export default Footer

