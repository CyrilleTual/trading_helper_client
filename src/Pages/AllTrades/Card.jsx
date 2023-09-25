import styles from "./card.module.css";
import PerfMeter from "../../Components/PerfMeter/Index";
import styleMeter from "../../Components/PerfMeter/perfMeter.module.css";
import { Loading } from "../../Components/Loading/Index";
import ProgressBar from "../../Components/ProgressBar/Index";
import BtnLink from "../../Components/UI/BtnLink";
import { calculMetrics } from "../../utils/calculateTradeMetrics";

function Card({ trade }) {
  if (!trade) {
    return;
  }

  // appel de la fonction qui retourne les métriques du trade
  const {
    tradeQuote,
    balance,
    balancePc,
    potential,
    potentialPc,
    risk,
    riskPc,
    rr,
    targetAtPc,
    riskAtPc,
  } = calculMetrics(trade);

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
            position={trade.position}
            tradeQuote={trade.tradeQuote}
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
