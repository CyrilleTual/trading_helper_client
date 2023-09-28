import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {

  useGetTradesActivesByUserQuery
} from "../../store/slice/tradeApi";
import styles from "./reEnter.module.css";
import { Loading } from "../../Components/Loading/Index";


import {calculMetrics} from "../../utils/calculateTradeMetrics"
import ReEnterCore from "./ReEnterCore";



function ReEnter() {
  const navigate = useNavigate();
  const { tradeId } = useParams();

  // on check si visiteur pour adapter l'affichage //////////////////////////////////////
  const role = useSelector((state) => state.user.infos.role);
  let id = useSelector((state) => state.user.infos.id);
  let isVisitor = false;
  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
    isVisitor = true;
  }

  // Récupère le trade  ///////////////////////////////////////////////
  const [trade, setTrade] = useState(null);
  // Récupère tous les trades ouverts par id d'user (deja dans le redux store)
  const {
    data: originalsTrades,
    isSuccess,
  } = useGetTradesActivesByUserQuery(id);

  // on complète les données du trade par les valeurs calculèes -> trade
  useEffect(() => {
    if (isSuccess) {
      const { tradeFull } = calculMetrics(
        originalsTrades.filter((trade) => +trade.tradeId === +tradeId)[0]
      );
      setTrade({ ...tradeFull });
    }
    // eslint-disable-next-line
  }, [isSuccess]);
  //////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {!isSuccess || !trade || isVisitor ? (
        <Loading />
      ) : (
        <main className={styles.re_enter}>
          <h1>Re-enter</h1>
         

          <div className="comments">
            {trade && (
              <>
                <p>
                  Portefeuille {trade.portfolio}, renforcer sur {trade.title} ?
                </p>
                <p>
                  C'est un trade {trade.position}, le dernier cours est à{" "}
                  {trade.lastQuote} {trade.symbol}.
                </p>
                <p>
                  Le PRU actuel est de {trade.pru} {trade.symbol} pour une ligne
                  de {trade.enterQuantity - trade.closureQuantity} titres.
                </p>
              </>
            )}
          </div>


          <ReEnterCore
            trade={trade}
            afterProcess={()=>navigate(`/portfolio/${trade.portfolioId}/detail`)}
          />
        </main>
      )}
    </>
  );
}

export default ReEnter;
