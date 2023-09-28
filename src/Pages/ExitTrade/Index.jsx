import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetTradesActivesByUserQuery,
} from "../../store/slice/tradeApi";
import { resetStorage } from "../../utils/tools";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../store/slice/user";
import styles from "./exitTrade.module.css";
import { Loading } from "../../Components/Loading/Index";
import { calculMetrics } from "../../utils/calculateTradeMetrics"; 
import ExitTradeCore from "./ExitTradeCore";

function ExitTrade() {
  const { tradeId } = useParams();

  // va recupérer les infos du trade
  // on check si visiteur pour adapter l'affichage //////////////////////////////////////
  const role = useSelector((state) => state.user.infos.role);
  let id = useSelector((state) => state.user.infos.id);
  let isVisitor = false;
  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
    isVisitor = true;
  }

  //////////  trade  //////////////////////////////////////////////////////////////////
  const [trade, setTrade] = useState(null);
  // Récupère tous les trades ouverts par id d'user (deja dans le redux store)
  const { data: originalsTrades, isSuccess, isError } =
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
  }, [isSuccess]);
  //////////////////////////////////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isError) {
      resetStorage();
      dispatch(signOut());
      navigate("/");
    }
    // eslint-disable-next-line
  }, [isError]);

  //*******************************************************
  return (
    <main className={styles.exit}>
      {!isSuccess || !trade || isVisitor ? (
        <Loading />
      ) : (
        <>
          <h1>Exit</h1>

          <p>
            Dans le poretefeuille "{trade.portfolio}" tu veux vendre{" "}
            {trade.title}?{" "}
          </p>
          <p>Le dernier cours est de {trade.lastQuote}</p>
          <p>
            Tu disposes de {trade.enterQuantity - trade.closureQuantity} titres
            en portefeuille
          </p>

          <ExitTradeCore
            trade={trade}
            afterProcess={() =>
              navigate(`/portfolio/${trade.portfolioId}/detail`)
            }
          />
        </>
      )}
    </main>
  );
}

export default ExitTrade;
