import styles from "./card.module.css";
import PerfMeter from "../../Components/PerfMeter/Index";
import { Loading } from "../../Components/Loading/Index";

function Card({trade}) {
   
 
  // metriques du trade en cours

  if (!trade) {
    return;
  }
 
  const balance = +(
    trade.position === "long"
      ? (+trade.lastQuote - trade.pru) * trade.actualQuantity
      : (+trade.pru - trade.lastQuote) * trade.actualQuantity
  ).toFixed(0);

  const balancePc = +(
    trade.position === "long"
      ? (trade.lastQuote - trade.pru) / trade.pru *100
      : (trade.pru - trade.lastQuote) / trade.pru *100
  ).toFixed(2);

  const potential =
    (trade.position === "long"
      ? (trade.target - trade.pru) * trade.actualQuantity
      : (trade.pru - trade.target) * trade.actualQuantity).toFixed(2);

  const potentialPc =
   ( trade.position === "long"
      ? (trade.target - trade.pru) / trade.pru *100
      : (trade.pru - trade.target) / trade.pru*100).toFixed(2);
  const risk =
    (trade.position === "long"
      ? (trade.stop - trade.pru) * trade.actualQuantity
      : (trade.pru - trade.stop) * trade.actualQuantity).toFixed(2);
  const riskPc =
    (trade.position === "long"
      ? (trade.stop - trade.pru) / trade.pru
      : (trade.pru - trade.stop) / trade.pru*100).toFixed(2);
  const rr = (risk < 0 ? -potential / risk : 0).toFixed(2);

  const targetAtPc = ((trade.target - trade.lastQuote) / trade.lastQuote *100).toFixed(2);
  const riskAtPc = ((trade.stop - trade.lastQuote) / trade.lastQuote*100).toFixed(2);

  return (
    <>
      {!trade ? (
        <Loading />
      ) : (
        <main className={styles.cardShow}>
          <h2 className={styles.title2}>{trade.title}</h2>
          <p>Portefeuille {trade.portfolio}</p>
          <p>
            C'est un trade {trade.position}, le dernier cours est à{" "}
            {(trade.lastQuote).toFixed(2)} {trade.symbol}.
          </p>
          <p>
            Le PRU est de {trade.pru.toFixed(2)} {trade.symbol} pour une ligne de{" "}
            {trade.actualQuantity} titres. <br />
            Ligne en {balance > 0 ? (
              <span>gain</span>
            ) : (
              <span>perte</span>
            )} de {balance} {trade.symbol} soit {balancePc.toFixed(2)} % .
            <br />
            Actuellement, objectif : {trade.target} {trade.symbol} et stop{" "}
            {trade.stop} {trade.symbol}
            <br />
            Si objectif ralié, {potential > 0 ? `gain de `: `perte` } {potential} {trade.symbol} soit {potentialPc} %.{" "}
            <br />
            Si stop déclenché, {risk<0?`perte de ` : 'gain de '}{risk} {trade.symbol} soit {riskPc} %.
            <br />
          </p>
          {rr > 0 ? (
            <p>Risk/reward de {rr}</p>
          ) : potential < 0 ? (
            <p>Trade perdant</p>
          ) : (
            <p>Trade sans rique</p>
          )}
          <p>L'objectifs est à {targetAtPc} % et le stop à {riskAtPc} % .</p>

          <div className={styles.meter_container}>
            <PerfMeter
              legend={
                balance > 0
                  ? `Gain actuel : ${balance} ${trade.symbol} `
                  : `Perte actuelle : ${balance} ${trade.symbol} `
              }
              min={risk}
              max={potential}
              perf={balance}
              meterWidth={styles.meterWidth}
              meterHeight={styles.meterHeight}
            />
          </div>
        </main>
      )}
    </>
  );
}

export default Card