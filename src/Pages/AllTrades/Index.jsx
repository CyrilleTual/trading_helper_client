import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetTradesActivesByUserQuery } from "../../store/slice/tradeApi";
import { lazy, Suspense } from "react";

import { prepare } from "./utils";
//import Card from "../../Components/Card/Card";
import BtnAction from "../../Components/UI/BtnAction";
import styles from "./index.module.css";

const Card = lazy(() => import("../../Components/Card/Card"));
/**
 * Composant Alltrades : Affiche la liste des trades actifs de l'utilisateur.
 * @param {number} portfolioId - L'identifiant du portefeuille (facultatif).
 * @returns {JSX.Element} - Le composant de la liste des trades actifs.
 */
function Alltrades({ portfolioId }) {
  /// gestion du statut visiteur //////////////////////////////////////

  const role = useSelector((state) => state.user.infos.role);

  let id = useSelector((state) => state.user.infos.id);
  

  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
     
  }

  ////// preparation des variables utilisées ici
  const [show, setShow] = useState({
    trades: [],
    tradesIds: [],
    portfoliosIds: [],
    selectedTradeId: null,
    indexOfTradeSelected: 0,
  });

  // Récupère tous les trades ouverts par id d'user
  const {
    data: originalsTrades,
 
    isSuccess: tradesisSuccess,
 
  } = useGetTradesActivesByUserQuery(id);

  // peuple les variables utilisées pour passer à la card les infos /////
  useEffect(() => {
    if (tradesisSuccess) {
      const { trades, tradesIds, portfoliosIds } = prepare(originalsTrades);

      if (typeof portfolioId === "undefined") {
        setShow({
          ...show,
          trades: trades,
          tradesIds: tradesIds,
          selectedTradeId: tradesIds[0],
          portfoliosIds: portfoliosIds,
        });
      }

      if (typeof portfolioId !== "undefined") {
        const tradesFiltered = trades.filter(
          (trade) => +trade.portfolioId === +portfolioId
        );
        setShow({
          ...show,
          trades: tradesFiltered,
          tradesIds: tradesIds,
          selectedTradeId: tradesIds[0],
          portfoliosIds: portfoliosIds,
        });
      }
    }
    // eslint-disable-next-line
  }, [tradesisSuccess, portfolioId]);

  const handleTopPage = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <>
      {!tradesisSuccess ? (
        <>Loading.... </>
      ) : (
        <>
          {show.trades.map((trade, key) => (
            <Suspense key={key}  fallback={<p>...</p>}>
              <Card trade={trade} />
            </Suspense>
          ))}

          <div className={styles.btn_wrapper}>
            <BtnAction
              action={() => handleTopPage()}
              value={"Haut de page"}
              name={"haut_de_page"}
            />
          </div>
        </>
      )}
    </>
  );
}

export default Alltrades;
