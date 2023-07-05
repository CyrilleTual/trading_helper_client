import React from "react";
import { useState } from "react";
import styles from "./nav.module.css";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../store/slice/user";

function Nav() {
  const [showLinks, setShowLinks] = useState(false);

  const handleShowLinks = () => {
    setShowLinks(!showLinks);
  };
  const dispatch = useDispatch();

  const handleLogOut = () => {
    // on efface le localStorage
   localStorage.removeItem("auth42titi@")
   localStorage.removeItem("remember");

    // on reset le state
    dispatch(signOut());
  }

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
            New trade
          </NavLink>
        </li>
        <li className={styles.navbar_item}>
          <NavLink
            className={`${styles.button} ${styles.navbar_link}`}
            to="/portfolio/manage"
          >
            Manage Portfolios
          </NavLink>
        </li>
        <li className={styles.navbar_item}>
          <NavLink className={`${styles.button} ${styles.navbar_link}`} to="/">
            Fund Portfolios
          </NavLink>
        </li>
        <li className={styles.navbar_item}>
          <NavLink
            className={`${styles.button} ${styles.navbar_link}`}
            onClick={handleLogOut}
            to="/"
          >
            LogOut
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
