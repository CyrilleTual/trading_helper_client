import styles from "./card.module.css";
import PerfMeter from "../PerfMeter/Index";
import styleMeter from "../../Components/PerfMeter/perfMeter.module.css";
import { Loading } from "../Loading/Index";
import ProgressBar from "../ProgressBar/Index";
import BtnLink from "../UI/BtnLink";
import { calculMetrics } from "../../utils/calculateTradeMetrics";
import { utilsMeter } from "../PerfMeter/utils";

function Card({ trade }) {
  if (!trade) {
    return;
  }
;

  // appel de la fonction qui retourne les métriques du trade
  const {
     tradeFull,
  } = calculMetrics(trade);
  // on reafecte le nom trade à l'objet complété 
  trade = {... tradeFull}
  
  // appel de la fonction qui retourne des variables utiles pour masquer le meter.
  const {meterInvalid, situation } = utilsMeter(trade);

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
            targetAtPc={ trade.targetAtPc}
            riskAtPc={ trade.riskAtPc}
            meterInvalid={meterInvalid}
            neutral={trade.neutral}
            position={trade.position}
            tradeQuote={ trade.tradeQuote}
            status={trade.status}
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
                   trade.balance > 0
                    ? `Gain : ${ trade.balance} ${trade.symbol} /  ${ trade.balancePc.toFixed(
                        2
                      )} %. `
                    : `Perte : ${ trade.balance} ${
                        trade.symbol
                      } /  ${ trade.balancePc.toFixed(2)} %. `
                }
                min={ trade. risk}
                max={ trade.potential}
                perf={ trade.balance}
                meterWidth={styles.meterWidth}
                meterHeight={styles.meterHeight}
              />
            </div>
          </div>
          {/* --------------------------------fin perfMeter --------------- */}

          <p>
            Si objectif ralié, { trade.potential > 0 ? `gain de ` : `perte`}{" "}
            { trade.potential} {trade.symbol} soit { trade.potentialPc} %. <br />
            Si stop déclenché, { trade. risk < 0 ? `perte de ` : "gain de "}
            { trade. risk} {trade.symbol} soit { trade.riskPc } %.
            <br />
          </p>
          { trade.rr > 0 ? (
            <p> trade. risk/reward de { trade.rr}</p>
          ) : trade. potential < 0 ? (
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
