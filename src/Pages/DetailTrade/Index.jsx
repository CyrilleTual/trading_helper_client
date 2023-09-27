import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetTradesActivesByUserQuery} from "../../store/slice/tradeApi";
import { Loading } from "../../Components/Loading/Index";
import styles from "./detailTrade.module.css"
import PerfMeter from "../../Components/PerfMeter/Index";
import styleMeter from "../../Components/PerfMeter/perfMeter.module.css"
import { useSelector } from "react-redux";
import { calculMetrics } from "../../utils/calculateTradeMetrics";
import { utilsMeter } from "../../Components/PerfMeter/utils";
import ProgressBar from "../../Components/ProgressBar/Index";


function DetailTrade() {
  /// gestion du statut visiteur //////////////////////////////////////

  const role = useSelector((state) => state.user.infos.role);

  let id = useSelector((state) => state.user.infos.id);
  let isVisitor = false;

  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
    isVisitor = true;
  }

  // recupère l'id du trade /////////////////////////////////////////
  const { tradeId } = useParams();

  const [trade, setTrade] = useState(null);
  // Récupère tous les trades ouverts par id d'user (deja dans le redux store)
  const {
    data: originalsTrades,
    isLoading: tradesIsLoading,
    isSuccess,
    isError: tradesisError1,
  } = useGetTradesActivesByUserQuery(id);

  // on selectionne le trade  valide
  // on complète les données du trade par les valeurs calculèes -> trade+
  useEffect(() => {
    if (isSuccess) {
      const { tradeFull } = calculMetrics(
        originalsTrades.filter((trade) => +trade.tradeId === +tradeId)[0]
      );
      setTrade({ ...tradeFull });
    }
  }, [isSuccess]);

  // appel de la fonction qui retourne des variables utiles pour masquer le meter.
  const [meterInvalid, setMeterInvalid] = useState(null);
  const [situation, setSituation] = useState(null);
  useEffect(() => {
    let result = null;
    if (trade) {
      const { meterInvalid, situation } = utilsMeter(trade);
      setMeterInvalid(meterInvalid);
      setSituation(situation);
    }
  }, [trade]);



  return (
    <>
      {!isSuccess && !trade ? (
        <Loading />
      ) : (
        <div className={styles.details}>
          <div className="comments">
            {trade && (
              <>
                <h1>{trade.title}</h1>
                <h2>Situation</h2>

                {/* --------------------------------- début perfMeter --------------- */}
                <div className={` ${styleMeter.wrapper_meter}`}>
                  <div
                    className={`${styleMeter.alertInvalid} ${
                      meterInvalid ? styleMeter.alertVisible : ""
                    } `}
                  >
                    <div className={`${styleMeter.alertInvalid_content} `}>
                      {situation}
                    </div>
                  </div>

                  <div
                    className={`${styleMeter.meter_container} ${
                      meterInvalid ? styleMeter.opacify : ""
                    }`}
                  >
                    <PerfMeter
                      legend={
                        trade.balance > 0
                          ? `Gain : ${trade.balance} ${
                              trade.symbol
                            } /  ${trade.balancePc.toFixed(2)} %. `
                          : `Perte : ${trade.balance} ${
                              trade.symbol
                            } /  ${trade.balancePc.toFixed(2)} %. `
                      }
                      min={trade.risk}
                      max={trade.potential}
                      perf={trade.balance}
                      meterWidth={styles.meterWidth}
                      meterHeight={styles.meterHeight}
                    />
                  </div>
                </div>
                {/* --------------------------------Progress bar  --------------- */}
                <ProgressBar
                  stop={trade.stop}
                  target={trade.target}
                  now={trade.lastQuote.toFixed(2)}
                  symbol={trade.symbol}
                  targetAtPc={trade.targetAtPc}
                  riskAtPc={trade.riskAtPc}
                  meterInvalid={meterInvalid}
                  neutral={trade.neutral}
                  position={trade.position}
                  tradeQuote={trade.tradeQuote}
                  status={trade.status}
                />
                {/* -------------------------------- Texte  --------------- */}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default DetailTrade