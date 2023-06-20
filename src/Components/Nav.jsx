import React from 'react'
import style from "./nav.module.css";
import { NavLink } from 'react-router-dom';

function Nav() {
  return (
    <div>
      <NavLink className={style.button} to="/">
        LogIn
      </NavLink>
      <NavLink className={style.button} to="/newTrade">
        New trade
      </NavLink>
      <NavLink className={style.button} to="/">
        Manage Portfolios
      </NavLink>
      <NavLink className={style.button} to="/">
        Fund Portfolios
      </NavLink>
      <NavLink className={style.button} to="/">
        LogOut
      </NavLink>
    </div>
  );
}

export default Nav