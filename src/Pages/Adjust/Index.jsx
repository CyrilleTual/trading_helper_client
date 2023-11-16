import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation, NavLink } from "react-router-dom";
import { useGetTradesActivesByUserQuery } from "../../store/slice/tradeApi";
import styles from "./adjust.module.css";
import { Loading } from "../../Components/Loading/Index";
import { calculMetrics } from "../../utils/calculateTradeMetrics";
import AdjustCore from "./AdjustCore";

import { ReactComponent as Next } from "../../assets/img/next.svg";
import { ReactComponent as Previous } from "../../assets/img/previous.svg";
  



function Adjust() {

  const navigate = useNavigate();
  const location = useLocation();
  const { portfolioId, tradesIdArray } = location.state;
  const { tradeId } = useParams();

  // on prépare les icones de navigations next et before //////////////////////////////////
  // recherche de l'index du trade actuel
  const indexOfActual = tradesIdArray.indexOf(+tradeId);
  const previousId =
    indexOfActual !== 0 && indexOfActual !== -1
      ? indexOfActual - 1
      : indexOfActual;
  const nextId =
    indexOfActual !== tradesIdArray.length - 1 && indexOfActual !== -1
      ? indexOfActual + 1
      : indexOfActual;
  const previousTradeId = tradesIdArray[previousId];
  const nextTradeId = tradesIdArray[nextId];

  // on check si visiteur pour adapter l'affichage //////////////////////////////////////
  const role = useSelector((state) => state.user.infos.role);
  let id = useSelector((state) => state.user.infos.id);
  let isVisitor = false;
  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
    isVisitor = true;
  }

  // Récupère le trade  ////////////////////////////////////////////////////////////////////////
  const [trade, setTrade] = useState(null);
  // Récupère tous les trades ouverts par id d'user (deja dans le redux store)
  const { data: originalsTrades, isSuccess } =
    useGetTradesActivesByUserQuery(id);

  // on complète les données du trade par les valeurs calculèes -> trade
  useEffect(() => {
    if (isSuccess) {
      const { tradeFull } = calculMetrics(
        originalsTrades.filter((trade) => +trade.tradeId === +tradeId)[0]
      );
      setTrade({ ...tradeFull });
    }
    // eslint-disable-next-line
  }, [tradeId, isSuccess]);
  //////////////////////////////////////////////////////////////////////////////////////////////////


  return (
    <>
      {!isSuccess || !trade || isVisitor ? (
        <Loading />
      ) : (
        <main className={styles.adjust}>
          <h1>Ajustement target/stop</h1>

          <div className="comments">
            {trade && (
              <>
                <h2>{trade.title}</h2>
                <p>Portefeuille {trade.portfolio}</p>
                <p>
                  C'est un trade {trade.position}, le dernier cours est à{" "}
                  {trade.lastQuote} {trade.symbol}.
                </p>
                <p>
                  Le PRU est de {trade.pru} {trade.symbol} pour une ligne de{" "}
                  {trade.remains} titres. <br />
                  Ligne en{" "}
                  {trade.balance > 0 ? (
                    <span>gain</span>
                  ) : (
                    <span>perte</span>
                  )}{" "}
                  de {trade.balance} {trade.symbol} soit{" "}
                  {trade.balancePc.toFixed(2)} % .
                  <br />
                  Actuellement, objectif : {trade.target} {trade.symbol} et stop{" "}
                  {trade.stop} {trade.symbol}
                  <br />
                  Si objectif ralié: {trade.potential} {trade.symbol} soit{" "}
                  {trade.potentialPc} %. <br />
                  Si stop déclenché: {trade.risk} {trade.symbol} soit{" "}
                  {trade.riskPc} %.
                  <br />
                </p>
                {trade.rr > 0 ? (
                  <p>Risk/reward de {trade.rr}</p>
                ) : trade.potential < 0 ? (
                  <p>Trade perdant</p>
                ) : (
                  <p>Trade sans rique</p>
                )}
              </>
            )}
          </div>

          <AdjustCore
            trade={trade}
            afterProcess={() =>
              navigate(`/portfolio/${trade.portfolioId}/detail`)
            }
          />

          <div className={styles.next_prev}>
            <NavLink
              className={`${styles.action} ${styles.prev}`}
              to={{
                pathname: `/portfolio/${portfolioId}/ajust/${previousTradeId}`,
              }}
              state={{
                portfolioId: portfolioId,
                tradesIdArray: tradesIdArray,
              }}
            >
              <Previous />
            </NavLink>

            <NavLink
              className={`${styles.action} ${styles.next}`}
              to={{
                pathname: `/portfolio/${portfolioId}/ajust/${nextTradeId}`,
              }}
              state={{
                portfolioId: portfolioId,
                tradesIdArray: tradesIdArray,
              }}
            >
              <Next />
            </NavLink>
          </div>
        </main>
      )}
    </>
  );
}

export default Adjust;
