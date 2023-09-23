import styles from "./card.module.css";
import PerfMeter from "../../Components/PerfMeter/Index";
import styleMeter from "../../Components/PerfMeter/perfMeter.module.css";
import { Loading } from "../../Components/Loading/Index";
import { toBeRequired } from "@testing-library/jest-dom/dist/matchers";

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
      ? ((trade.lastQuote - trade.pru) / trade.pru) * 100
      : ((trade.pru - trade.lastQuote) / trade.pru) * 100
  ).toFixed(2);

  const potential = (
    trade.position === "long"
      ? (trade.target - trade.pru) * trade.actualQuantity
      : (trade.pru - trade.target) * trade.actualQuantity
  ).toFixed(2);

  const potentialPc = (
    trade.position === "long"
      ? ((trade.target - trade.pru) / trade.pru) * 100
      : ((trade.pru - trade.target) / trade.pru) * 100
  ).toFixed(2);
  const risk = (
    trade.position === "long"
      ? (trade.stop - trade.pru) * trade.actualQuantity
      : (trade.pru - trade.stop) * trade.actualQuantity
  ).toFixed(2);
  const riskPc = (
    trade.position === "long"
      ? (trade.stop - trade.pru) / trade.pru
      : ((trade.pru - trade.stop) / trade.pru) * 100
  ).toFixed(2);
  const rr = (risk < 0 ? -potential / risk : 0).toFixed(2);

  const targetAtPc = (
    ((trade.target - trade.lastQuote) / trade.lastQuote) *
    100
  ).toFixed(2);
  const riskAtPc = (
    ((trade.stop - trade.lastQuote) / trade.lastQuote) *
    100
  ).toFixed(2);

  // verification de la validité du stop et tp pour mascage du meter
  const meterInvalid =
  (trade.position === "long" &&
      trade.stop < trade.lastQuote &&
      trade.target > trade.lastQuote) ||
    (trade.position === "short" &&
      trade.target < trade.lastQuote &&
      trade.stop > trade.lastQuote)
      ? false
      : true;
  

  const situation =
    meterInvalid &&
    ((trade.position === "long" && trade.lastQuote > trade.target) ||
      (trade.position === "short" && trade.lastQuote < trade.target))
      ? "Objectif Atteint, Bravo !"
      : "Stop déclanché.";



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
            {trade.lastQuote.toFixed(2)} {trade.symbol}.
          </p>
          <p>
            Le PRU est de {trade.pru.toFixed(2)} {trade.symbol} pour une ligne
            de {trade.actualQuantity} titres. <br />
            Ligne en {balance > 0 ? (
              <span>gain</span>
            ) : (
              <span>perte</span>
            )} de {balance} {trade.symbol} soit {balancePc.toFixed(2)} % .
            <br />
            Actuellement, objectif : {trade.target} {trade.symbol} et stop{" "}
            {trade.stop} {trade.symbol}
            <br />
            Si objectif ralié, {potential > 0 ? `gain de ` : `perte`}{" "}
            {potential} {trade.symbol} soit {potentialPc} %. <br />
            Si stop déclenché, {risk < 0 ? `perte de ` : "gain de "}
            {risk} {trade.symbol} soit {riskPc} %.
            <br />
          </p>
          {rr > 0 ? (
            <p>Risk/reward de {rr}</p>
          ) : potential < 0 ? (
            <p>Trade perdant</p>
          ) : (
            <p>Trade sans rique</p>
          )}
          <p>
            L'objectifs est à {targetAtPc} % et le stop à {riskAtPc} % .
          </p>

          {/* --------------------------------- début perfMeter --------------- */}
          <div className={` ${styleMeter.wrapper_meter}`}>
            <div
              className={`${styleMeter.alertInvalid} ${
                meterInvalid ? styleMeter.alertVisible : ""
              } `}
            >
              <div className={`${styleMeter.alertInvalid_content} `}>
                {" "}
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
          </div>
          {/* --------------------------------fin perfMeter --------------- */}
        </main>
      )}
    </>
  );
}

export default Card