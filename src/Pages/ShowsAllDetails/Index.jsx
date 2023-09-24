import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetTradesActivesByUserQuery } from "../../store/slice/tradeApi";

import { Loading } from "../../Components/Loading/Index";
import { prepare } from "./utils";
import Card from "./Card";
import BtnAction from "../../Components/UI/BtnAction";
import styles from "./index.module.css";

function ShowAllDetails() {
  /// gestion du statut visiteur //////////////////////////////////////

  const role = useSelector((state) => state.user.infos.role);
  let id = useSelector((state) => state.user.infos.id);
  let isVisitor = false;

  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
    isVisitor = true;
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
    isLoading: tradesIsLoading,
    isSuccess: tradesisSuccess,
    isError: tradesisError1,
  } = useGetTradesActivesByUserQuery(id);

  // peuple les variables utilisées pour passer à la card les infos /////
  useEffect(() => {
    if (tradesisSuccess) {
      const { trades, tradesIds, portfoliosIds } = prepare(originalsTrades);
      setShow({
        ...show,
        trades: trades,
        tradesIds: tradesIds,
        selectedTradeId: tradesIds[0],
        portfoliosIds: portfoliosIds,
      });
    }
  }, [tradesisSuccess]);

  // action sur les boutons previous et next
  const handleClick = (action) => {
    if (action === "previous") {
      if (show.indexOfTradeSelected !== 0) {
        setShow({
          ...show,
          indexOfTradeSelected: show.indexOfTradeSelected - 1,
        });
      }
    }
    if (action === "next") {
      if (show.indexOfTradeSelected < show.trades.length - 1) {
        setShow({
          ...show,
          indexOfTradeSelected: show.indexOfTradeSelected + 1,
        });
      }
    }
  };



  return (
    <>
      {!tradesisSuccess ? (
        <Loading />
      ) : (
        <>
          <h1>Details des trades</h1>
          {show.trades.map ((trade, key )=>(
            <Card key= {key} trade={trade} />
          ))}

          <div className={styles.btn_wrapper}>
            <span className={styles.btn}>
              <BtnAction
                className={styles.btn}
                value={"Previous"}
                action={() => handleClick("previous")}
                name={"previous"}
              />
            </span>

            <span className={styles.btn}>
              <BtnAction
                className={styles.btnDetail}
                value={"Next"}
                action={() => handleClick("next")}
                name={"next"}
              />
            </span>
          </div>
        </>
      )}
    </>
  );
}

export default ShowAllDetails;
