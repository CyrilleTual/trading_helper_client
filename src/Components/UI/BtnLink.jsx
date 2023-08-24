 import { NavLink } from "react-router-dom";
 import styles from "./btn.module.css";

function BtnLink({link, title, name}) {
  return (
    <NavLink className={styles.myBtn} to={link} name={name}>
      {title}
    </NavLink>
  )
}

export default BtnLink