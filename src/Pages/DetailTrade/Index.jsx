import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePrepareQuery } from "../../store/slice/tradeApi";
import { calculMetrics } from "./metrics";
import { Loading } from "../../Components/Loading/Index";
import styles from "./detailTrade.module.css"
import PerfMeter from "../../Components/PerfMeter/Index";



function DetailTrade() {
  // recupère l'id du trade /////////////////////////////////////////
  const { tradeId } = useParams();

  // va recupérer les infos du trade avec son id ////////////////////
  const { data: trade, isSuccess } = usePrepareQuery(tradeId);

  // valeurs calculées: métriques du trade en cours//////////////////
  const [metrics, setMetrics] = useState({
    balance: 0,
    balancePc: 0,
    potential: 0,
    potentialPc: 0,
    risk: 0,
    riskPc: 0,
    rr: 0,
    targetAtPc: 0,
    riskAtPc: 0,
  });
  ///// calcul des valeurs  
  useEffect(() => {
    if (isSuccess) {
      calculMetrics(trade, metrics, setMetrics);
    }
    // eslint-disable-next-line
  }, [trade]);

  return (
    <>
      {!isSuccess || !metrics ? (
        <Loading />
      ) : (
        <div className={styles.details}>
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
                  {metrics.balance > 0 ? (
                    <span>gain</span>
                  ) : (
                    <span>perte</span>
                  )}{" "}
                  de {metrics.balance} {trade.symbol} soit{" "}
                  {metrics.balancePc.toFixed(2)} % .
                  <br />
                  Actuellement, objectif : {trade.target} {trade.symbol} et stop{" "}
                  {trade.stop} {trade.symbol}
                  <br />
                  Si objectif ralié: {metrics.potential} {trade.symbol} soit{" "}
                  {metrics.potentialPc} %. <br />
                  Si stop déclanché: {metrics.risk} {trade.symbol} soit{" "}
                  {metrics.riskPc} %.
                  <br />
                </p>
                {metrics.rr > 0 ? (
                  <p>Risk/reward de {metrics.rr}</p>
                ) : metrics.potential < 0 ? (
                  <p>Trade perdant</p>
                ) : (
                  <p>Trade sans rique</p>
                )}
              </>
            )}
          </div>
          <div className={styles.meter_container}>
            <PerfMeter
              legend={
                metrics.balance > 0
                  ? `Gain actuel : ${metrics.balance} ${trade.symbol} `
                  : `Perte actuelle : ${metrics.balance} ${trade.symbol} `
              }
              min={metrics.risk}
              max={metrics.potential}
              perf={metrics.balance}
              meterWidth={styles.meterWidth}
              meterHeight={styles.meterHeight}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default DetailTrade