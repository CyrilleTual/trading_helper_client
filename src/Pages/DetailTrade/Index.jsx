import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetTradesActivesByUserQuery } from "../../store/slice/tradeApi";
import { Loading } from "../../Components/Loading/Index";
import { calculMetrics } from "../../utils/calculateTradeMetrics";
import { utilsMeter } from "../../Components/PerfMeter/utils";
import styles from "./detailTrade.module.css";
import styleMeter from "../../Components/PerfMeter/perfMeter.module.css";
import PerfMeter from "../../Components/PerfMeter/Index";
import ProgressBar from "../../Components/ProgressBar/Index";
import { datetimeToFrShort } from "../../utils/tools";
import ReEnterCore from "../ReEnter/ReEnterCore";
import ExitTradeCore


from "../ExitTrade/ExitTradeCore";
function DetailTrade() {
  const navigate = useNavigate();
  /// gestion du statut visiteur //////////////////////////////////////
  const role = useSelector((state) => state.user.infos.role);
  let id = useSelector((state) => state.user.infos.id);
  let isVisitor = false;
  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
    isVisitor = true;
  }

  // recupère l'id du trade depuis l'URL ///////////////////////////////
  const { tradeId } = useParams();

  const [trade, setTrade] = useState(null);
  // Récupère tous les trades ouverts par id d'user (deja dans le redux store)
  const { data: originalsTrades, isSuccess } =
    useGetTradesActivesByUserQuery(id);

  // on selectionne le trade  valide
  // on complète les données du trade par les valeurs calculées
  useEffect(() => {
    if (isSuccess) {
      const { tradeFull } = calculMetrics(
        originalsTrades.filter((trade) => +trade.tradeId === +tradeId)[0]
      );
      setTrade({ ...tradeFull });
    }

    // eslint-disable-next-line
  }, [originalsTrades, isSuccess]);



  // appel de la fonction qui retourne des variables utiles pour masquer le meter.
  const [meterInvalid, setMeterInvalid] = useState(null);
  const [situation, setSituation] = useState(null);
  const [varBeforePc, setVarBeforePc] = useState(null);
  useEffect(() => {
    if (trade) {
      const { meterInvalid, situation } = utilsMeter(trade);
      setMeterInvalid(meterInvalid);
      setSituation(situation);
      setVarBeforePc(
        ((+trade.lastQuote - trade.beforeQuote) / trade.beforeQuote) * 100
      );
    }
  }, [trade ]);

 
  

  ///////////////////////// Display /////////////////////////////////////////////////////
  return (
    <>
      {!isSuccess || !trade || !varBeforePc ? (
        <Loading />
      ) : (
        trade && (
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
                  <h3>Actif :</h3>
                  <ul>
                    <li>
                      {trade.title} / {trade.isin} / {trade.ticker} /
                      {trade.place}
                    </li>
                    <li>
                      {" "}
                      Dernier {trade.lastQuote} {trade.symbol}
                      {" soit  "}{" "}
                      {varBeforePc >= 0
                        ? "+" + varBeforePc.toFixed(2)
                        : "-" + varBeforePc.toFixed(2)}{" "}
                      % / veille
                    </li>
                    <li>
                      Trade {trade.position} / stratégie {trade.strategy} /{" "}
                      {trade.portfolio}
                    </li>
                    <li>
                      Ouverture du trade le{" "}
                      {datetimeToFrShort(trade.firstEnter)}
                    </li>
                    {trade.status === "OnGoing" && (
                      <li>
                        Le trade est actif avec{" "}
                        {trade.enterQuantity - trade.closureQuantity} titres{" "}
                      </li>
                    )}
                    {trade.status === "OnStop" && (
                      <li>Le trade est perdant. Le stop à été touché.</li>
                    )}
                    {trade.status === "OnTarget" && (
                      <li>Le trade est gagant. L'objectif est atteint.</li>
                    )}
                    <li>
                      Valorisation :{" "}
                      {(trade.enterQuantity - trade.closureQuantity) *
                        trade.tradeQuote}{" "}
                      {trade.symbol} (
                      {trade.enterQuantity - trade.closureQuantity}*
                      {trade.tradeQuote} {trade.symbol})
                    </li>
                    <li>
                      {trade.position === "long" && (
                        <>
                          PRU {trade.pru.toFixed(2)} {trade.symbol} {" - "}
                        </>
                      )}
                      {trade.position === "short" && (
                        <>
                          Point neutre {trade.neutral.toFixed(2)} {trade.symbol}
                          {" - "}
                        </>
                      )}
                      Stop {trade.stop} {trade.symbol} - Objectif {trade.target}{" "}
                      {trade.symbol}
                    </li>
                  </ul>
                  <p>
                    Si objectif ralié,{" "}
                    {trade.potential > 0 ? `gain de ` : `perte`}{" "}
                    {trade.potential} {trade.symbol} soit {trade.potentialPc} %.{" "}
                    <br />
                    Si stop déclenché,{" "}
                    {trade.risk < 0 ? `perte de ` : "gain de "}
                    {trade.risk} {trade.symbol} soit {trade.riskPc} %.
                    <br />
                  </p>
                  {trade.rr > 0 ? (
                    <p> Risk/reward de {trade.rr}</p>
                  ) : trade.potential < 0 ? (
                    <p>Trade perdant</p>
                  ) : (
                    <p>Trade sans rique</p>
                  )}
                </>
              )}
            </div>
            {!isVisitor && (
              <>
                <div className={styles.reEnter}>
                  <h3>Renforcer la position</h3>
                  <ReEnterCore
                    trade={trade}
                    afterProcess={() => {
                      navigate(
                        `/portfolio/${trade.portfolioId}/detail/${trade.tradeId}`
                      );
                    }}
                  />
                </div>
                <div className={styles.exit}>
                  <h3>Alléger la position</h3>
                  <ExitTradeCore
                    trade={trade}
                    afterProcess={() =>
                      navigate(
                        `/portfolio/${trade.portfolioId}/detail/${trade.tradeId}`
                      )
                    }
                  />
                </div>
              </>
            )}
          </div>
        )
      )}
    </>
  );
}

export default DetailTrade;
