import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetPortfoliosByUserQuery } from "../../store/slice/tradeApi";
import styles from "./navPortfolio.module.css";

function NavPorfolios() {
  // pour les onglets besion de la liste des portfolios pour cet user
  const id = useSelector((state) => state.user.infos.id);

  // on va recupere la liste des portfolios de l'user -> portfolios
  // eslint-disable-next-line
  const { data: portfolios, isLoading } = useGetPortfoliosByUserQuery(id);

  return (
    <>
      {isLoading ? (
        <p>loading</p>
      ) : (
        <div className={styles.navPortfolios}>
          <NavLink
            to="/global"
            className={`${styles.button}`}
            style={({ isActive }) =>
              isActive
                ? {
                    color: "#fff",
                    background: "#696969",
                  }
                : { color: "#545e6f", background: "#f0f0f0" }
            }
          >
            Summary
          </NavLink>
          {portfolios.map((portfolio, i) => (
            <NavLink
              key={i}
              className={styles.button}
              to={`/portfolio/${portfolio.id}`}
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "#fff",
                      background: "#696969",
                    }
                  : { color: "#545e6f", background: "#f0f0f0" }
              }
            >
              {portfolio.title}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}

export default NavPorfolios;
