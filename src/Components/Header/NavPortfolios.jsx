import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetPortfoliosByUserQuery } from "../../store/slice/tradeApi";
import styles from "./navPortfolio.module.css";
 

function NavPorfolios() {
  // pour les onglets besion de la liste des portfolios pour cet user
  let id = useSelector((state) => state.user.infos.id);

  const role = useSelector((state) => state.user.infos.role);

  // si visitor -> on change id 
  if (role.substring(0,7) === "visitor"){
    id =  (role.substring(8))
  }
 
  // on va recupere la liste des portfolios de l'user -> portfolios
  // eslint-disable-next-line
  const { data: portfolios, isLoading } = useGetPortfoliosByUserQuery(id);

  // pour avoir le css sur l'onglet correct -> quand on passe dans le detail
  // extract pathname from location
  const { pathname } = useLocation();

  return (
    <>
      {isLoading ? (
        <p>loading</p>
      ) : (
        <div className={styles.navPortfoliosContainer}>
          <div className={styles.navPortfolios}>
            <NavLink
              to="/global"
              className={
                ["/global"].includes(pathname)
                  ? `${styles.button} ${styles.active}`
                  : `${styles.button}`
              }
            >
              - Global -
            </NavLink>

            {portfolios.map((portfolio, i) => (
              <NavLink
                key={i + 1}
                className={
                  pathname.indexOf(`/portfolio/${portfolio.id}/`) !== -1
                    ? `${styles.button} ${styles.active}`
                    : `${styles.button}`
                }
                to={`/portfolio/${portfolio.id}/`}
              >
                {portfolio.title}
              </NavLink>
            ))}
            {/* <NavLink
              to="/test"
            >
              - Test -
            </NavLink> */}
          </div>
        </div>
      )}
    </>
  );
}

export default NavPorfolios;
