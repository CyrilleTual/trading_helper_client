import styles from "./card.module.css";
import PerfMeter from "../../Components/PerfMeter/Index";
import styleMeter from "../../Components/PerfMeter/perfMeter.module.css";
import { Loading } from "../../Components/Loading/Index";
import { toBeRequired } from "@testing-library/jest-dom/dist/matchers";

function Card({trade}) {
  // metriques du trade en cours

  if (!trade) {
    return ;
  }

  let tradeQuote = null;
  /// si on est sur stop ou objectif  tradeQuote = stop ou objectif 
  if (trade.position === "long") {
    if (trade.lastQuote > trade.target) {
      tradeQuote = trade.target;
    } else if (trade.lastQuote < trade.stop) {
      tradeQuote = trade.stop;
    } else {
      tradeQuote = trade.lastQuote;
    }
  } else if (trade.position === "short") {
    if (trade.lastQuote < trade.target) {
      tradeQuote = trade.target;
    } else if (trade.lastQuote > trade.stop) {
      tradeQuote = trade.stop;
    } else {
      tradeQuote = trade.lastQuote;
    }
  }

  const balance = +(
    trade.position === "long"
      ? (+tradeQuote - trade.pru) * trade.actualQuantity
      : (+trade.pru - tradeQuote) * trade.actualQuantity
  ).toFixed(0);

  const balancePc = +(
    trade.position === "long"
      ? ((tradeQuote - trade.pru) / trade.pru) * 100
      : ((trade.pru - tradeQuote) / trade.pru) * 100
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
    ((trade.target - tradeQuote) / tradeQuote) *
    100
  ).toFixed(2);
  const riskAtPc = (
    ((trade.stop - tradeQuote) / tradeQuote) *
    100
  ).toFixed(2);

  // verification de la validité du stop et tp pour mascage du meter
  const meterInvalid =
  (trade.position === "long" &&
      trade.stop < tradeQuote &&
      trade.target > tradeQuote) ||
    (trade.position === "short" &&
      trade.target < tradeQuote &&
      trade.stop > tradeQuote)
      ? false
      : true;
  

  const situation =
    meterInvalid &&
    ((trade.position === "long" && trade.lastQuote > trade.target) ||
      (trade.position === "short" && trade.lastQuote < trade.target)) ? (
      <>
        Objectif Atteint. <br />
        {potential > 0 ? `Gain de ` : `Perte`} {potential} {trade.symbol} soit{" "}
        {potentialPc} %.
      </>
    ) : (
      <>
        Stop touché, <br />
        {risk < 0 ? `perte de ` : "gain de "}
        {risk} {trade.symbol} soit {riskPc} %.
      </>
    );



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
            L'objectif est à {targetAtPc} % et le stop à {riskAtPc} % .
          </p>

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
                  balance > 0
                    ? `Gain : ${balance} ${trade.symbol} /  ${balancePc.toFixed(
                        2
                      )} %. `
                    : `Perte : ${balance} ${
                        trade.symbol
                      } /  ${balancePc.toFixed(2)} %. `
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