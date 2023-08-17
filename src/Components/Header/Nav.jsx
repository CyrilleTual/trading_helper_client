import React from "react";
import { useState } from "react";
import styles from "./nav.module.css";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../store/slice/user";
import { resetStorage } from "../../utils/tools"
 

function Nav() {
  const [showLinks, setShowLinks] = useState(false);

  const handleShowLinks = () => {
    setShowLinks(!showLinks);
  };
  const dispatch = useDispatch();

  const handleLogOut = () => {
    // on efface le localStorage
    resetStorage();
    // on reset le state
    dispatch(signOut());
  };

  return (
    <div
      className={`${styles.navbar} ${
        showLinks ? styles.show_nav : styles.hide
      }`}
    >
      <button className={styles.navbar_burger} onClick={handleShowLinks}>
        <span className={styles.burger_bar}></span>
      </button>
      <ul className={styles.navbar_links} onClick={handleShowLinks}>
        <li className={styles.navbar_item}>
          <NavLink
            className={`${styles.button} ${styles.navbar_link}`}
            to="/newTrade"
          >
            Créer un nouveau trade
          </NavLink>
        </li>
        <li className={styles.navbar_item}>
          <NavLink
            className={`${styles.button} ${styles.navbar_link}`}
            to="/portfolio/manage"
          >
            Gérer les portefeuilles
          </NavLink>
        </li>
        <li className={styles.navbar_item}>
          <NavLink className={`${styles.button} ${styles.navbar_link}`} to="/strategies">
            Gérer les stratégies
          </NavLink>
        </li>
        <li className={styles.navbar_item}>
          <NavLink
            className={`${styles.button} ${styles.navbar_link}`}
            onClick={handleLogOut}
            to="/"
          >
            Se déconnecter
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
