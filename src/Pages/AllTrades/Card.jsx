import styles from "./card.module.css";
import PerfMeter from "../../Components/PerfMeter/Index";
import styleMeter from "../../Components/PerfMeter/perfMeter.module.css";
import { Loading } from "../../Components/Loading/Index";
import ProgressBar from "../../Components/ProgressBar/Index";
import BtnLink from "../../Components/UI/BtnLink";

function Card({ trade }) {
  // metriques du trade en cours

  if (!trade) {
    return;
  }

  /// si on est sur stop ou objectif  tradeQuote = stop ou objectif
  let tradeQuote = null;
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
      ? (+tradeQuote - trade.neutral) * trade.actualQuantity
      : (+trade.neutral - tradeQuote) * trade.actualQuantity
  ).toFixed(0);

  const balancePc = +(
    trade.position === "long"
      ? ((tradeQuote - trade.neutral) / trade.neutral) * 100
      : ((trade.neutral - tradeQuote) / trade.neutral) * 100
  ).toFixed(2);

  const potential = (
    trade.position === "long"
      ? (trade.target - trade.neutral) * trade.actualQuantity
      : (trade.neutral - trade.target) * trade.actualQuantity
  ).toFixed(2);

  const potentialPc = (
    trade.position === "long"
      ? ((trade.target - trade.neutral) / trade.neutral) * 100
      : ((trade.neutral - trade.target) / trade.neutral) * 100
  ).toFixed(2);
  const risk = (
    trade.position === "long"
      ? (trade.stop - trade.neutral) * trade.actualQuantity
      : (trade.neutral - trade.stop) * trade.actualQuantity
  ).toFixed(2);
  const riskPc = (
    trade.position === "long"
      ? (trade.stop - trade.neutral) / trade.neutral
      : ((trade.neutral - trade.stop) / trade.neutral) * 100
  ).toFixed(2);
  const rr = (risk < 0 ? -potential / risk : 0).toFixed(2);

  const targetAtPc = (((trade.target - tradeQuote) / tradeQuote) * 100).toFixed(
    2
  );
  const riskAtPc = (((trade.stop - tradeQuote) / tradeQuote) * 100).toFixed(2);

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
        <article className={styles.cardShow}>
          <h3 className={styles.title2}>{trade.title}</h3>
          <p>
            Portefeuille {trade.portfolio} - Dernier{" "}
            {trade.lastQuote.toFixed(2)} {trade.symbol}
          </p>
          <p>
            {trade.position === "long" && (
              <>
                Trade {trade.position} - PRU {trade.pru.toFixed(2)}{" "}
                {trade.symbol} {" - "}
              </>
            )}
            {trade.position === "short" && (
              <>
                Trade {trade.position} - Point neutre {trade.neutral.toFixed(2)}{" "}
                {trade.symbol}
                {" - "}
              </>
            )}
            {trade.actualQuantity} titres. <br />
          </p>

          <ProgressBar
            stop={trade.stop}
            target={trade.target}
            now={trade.lastQuote.toFixed(2)}
            symbol={trade.symbol}
            targetAtPc={targetAtPc}
            riskAtPc={riskAtPc}
            meterInvalid={meterInvalid}
            neutral={trade.neutral}
          />

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

          <p>
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
          <div className={styles.wrapper_btn}>
            <BtnLink
              link={`/portfolio/${trade.portfolioId}/detail/${trade.tradeId}`}
              title={`Détails`}
              name="détails"
            />
          </div>
        </article>
      )}
    </>
  );
}

export default Card;
