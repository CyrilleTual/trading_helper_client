import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetPortfoliosByUserQuery } from "../store/slice/tradeApi";
import style from "./navPortfolios.module.css";

function NavPorfolios() {
  // pour les onglets besion de la liste des portfolios pour cet user
  // on recupère l'idduuser depuis le store -> id
  const { id } = useSelector((state) => ({
    ...state.user.infos,
  }));
  // on va recupere la liste des portfolios de l'user -> portfolios
  // eslint-disable-next-line
  const { data: portfolios, isLoading } = useGetPortfoliosByUserQuery(id);

  return (
    <>
      {isLoading ? (
        <p>loading</p>
      ) : (
        <>
          <NavLink className={style.button} to="/">
            LogIn
          </NavLink>
          <NavLink className={style.button} to="/global">
            Summary
          </NavLink>
          {portfolios.map((portfolio, i) => (
            <NavLink key={i} className={style.button} to={`/portfolio/${portfolio.id}`}>
              {portfolio.title}
            </NavLink>
          ))}
        </>
      )}
    </>
  );
}

export default NavPorfolios;
