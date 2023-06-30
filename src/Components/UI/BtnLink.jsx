 import { NavLink } from "react-router-dom";
 import styles from "./btn.module.css";

function BtnLink({link, title}) {
  return (
    <NavLink className={styles.myBtn} to={link}>
      {title}
    </NavLink>
  )
}

export default BtnLink