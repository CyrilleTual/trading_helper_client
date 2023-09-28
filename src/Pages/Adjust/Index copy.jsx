import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation, NavLink } from "react-router-dom";
import {
  usePrepareQuery,
  useGetPortfoliosByUserQuery,
  useAdjustmentMutation,
} from "../../store/slice/tradeApi";
import styles from "./adjust.module.css";
import { Loading } from "../../Components/Loading/Index";
import BtnSubmit from "../../Components/UI/BtnSubmit";
import BtnCancel from "../../Components/UI/BtnCancel";
import Modal from "../../Components/Modal/Index";
import { validate } from "./validateInputsAdjust";
import { calculMetrics, calculNewMetrics } from "./metrics.js";
import PerfMeter from "../../Components/PerfMeter/Index";
import styleMeter from "../../Components/PerfMeter/perfMeter.module.css";

function Adjust() {
  const navigate = useNavigate();
  const location = useLocation();

  const { portfolioId, tradesIdArray } = location.state;
  const { tradeId } = useParams();

  // on prépare les icones de navigations next et before ////////////////////////
  // recherche de l'index du trade actuel
  const indexOfActual = tradesIdArray.indexOf(+tradeId);
  const previousId =
    indexOfActual !== 0 && indexOfActual !== -1
      ? indexOfActual - 1
      : indexOfActual;
  const nextId =
    indexOfActual !== tradesIdArray.length - 1 && indexOfActual !== -1
      ? indexOfActual + 1
      : indexOfActual;
  const previousTradeId = tradesIdArray[previousId];
  const nextTradeId = tradesIdArray[nextId];

  // va recupérer les infos du trade avec son id
  const { data: trade, isSuccess } = usePrepareQuery(tradeId);










  // on se sert des portfolios pour obtenir le symbole des currencies
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const { data: portfolios, isSuccess: isSuccess1 } =
    useGetPortfoliosByUserQuery(useSelector((state) => state.user.infos.id));

  // metriques du trade en cours
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

  // nouveaux metriques
  const [newMetrics, setNewMetrics] = useState({
    valid: true,
    potential: 0,
    potentialPc: 0,
    risk: 0,
    riskPc: 0,
    rr: 0,
    targetAtPc: null,
    riskAtPc: null,
  });

  useEffect(() => {
    if (trade && portfolios) {
      let { symbol } = portfolios.find(
        (portfolio) => portfolio.title === trade.portfolio
      );
      setCurrencySymbol(symbol);
    }
  }, [trade, portfolios]);

  // hook d'ajustement
  const [adjustment] = useAdjustmentMutation();

  ///  disponible pour l'affichage : ( trade . qq chose)
  //   const {
  //   closureQuantity,
  //   closureValue,
  //   comment,
  //   enterQuantity,
  //   enterValue,
  //   exposition,
  //   firstEnter,
  //   isin,
  //   lastQuote,
  //   place,
  //   portfolio,
  //   position,
  //   pru,
  //   remains,
  //   stop,
  //   target,
  //   ticker,
  //   title,
  //   tradeId,
  // } = data;

  // valeurs de l'ajustement
  const [values, setValues] = useState({
    date: new Date().toISOString().split("T")[0],
    comment: "",
    target: 0,
    stop: 0,
  });

  ///// calcul des valeurs  initiales ////////////////
  useEffect(() => {
    if (isSuccess) {
      setValues({
        ...values,
        price: trade.lastQuote,
        target: trade.target,
        stop: trade.stop,
        comment: trade.comment,
        position: trade.position,
      });
      calculMetrics(trade, metrics, setMetrics);
    }
    // eslint-disable-next-line
  }, [trade]);

  // calcul avec les nouveaux paramèrtes
  useEffect(() => {
    if (isSuccess) {
      calculNewMetrics(trade, values, newMetrics, setNewMetrics);
    }
    // eslint-disable-next-line
  }, [values]);

  // variable pour invalider la jauge 
  const [meterInvalid, setMeterInvalid] = useState(false);
  useEffect(() => {
    newMetrics.valid === false ? setMeterInvalid(true) : setMeterInvalid(false);
  }, [newMetrics]);

  /// to do -> verifier que l'on est bien sur le bon trade
  /// -> tradeId === trade.tradeId ?

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [errorsInForm, setErrorsInForm] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Appel de la fonction de traitement des données du formulaire
    const { inputErrors, verifiedValues } = validate(values, trade.position);

    if (inputErrors.length > 0) {
      setErrorsInForm(inputErrors);
    } else {
      const datas = {
        date: verifiedValues.date,
        target: verifiedValues.target,
        stop: verifiedValues.stop,
        comment: verifiedValues.comment,
        trade_id: +tradeId,
        stock_id: +trade.stock_id,
      };
      try {
        const resp = await adjustment(datas);
        console.log(resp);
        navigate(`/portfolio/${trade.portfolio_id}/detail`);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const afterError = () => {
    setErrorsInForm([]);
  };

  /////// cancel enter
  function cancelEnter() {
    navigate(`/portfolio/${trade.portfolio_id}/detail`);
  }

  return (
    <>
      {!isSuccess && !isSuccess1 ? (
        <Loading />
      ) : (
        <main className={styles.adjust}>
          <h1>Ajustement target/stop</h1>
          {errorsInForm.length > 0 && (
            <Modal
              display={
                <p>
                  Validation du formulaire impossible : <br />
                  {errorsInForm.map((error, j) => (
                    <span key={j}>
                      {error}
                      <br />
                    </span>
                  ))}
                </p>
              }
              action={afterError}
            />
          )}

          <div className="comments">
            {trade && (
              <>
                <h2>{trade.title}</h2>
                <p>Portefeuille {trade.portfolio}</p>
                <p>
                  C'est un trade {trade.position}, le dernier cours est à{" "}
                  {trade.lastQuote} {currencySymbol}.
                </p>
                <p>
                  Le PRU est de {trade.pru} {currencySymbol} pour une ligne de{" "}
                  {trade.remains} titres. <br />
                  Ligne en{" "}
                  {metrics.balance > 0 ? (
                    <span>gain</span>
                  ) : (
                    <span>perte</span>
                  )}{" "}
                  de {metrics.balance} {currencySymbol} soit{" "}
                  {metrics.balancePc.toFixed(2)} % .
                  <br />
                  Actuellement, objectif : {trade.target} {currencySymbol} et
                  stop {trade.stop} {currencySymbol}
                  <br />
                  Si objectif ralié: {metrics.potential} {currencySymbol} soit{" "}
                  {metrics.potentialPc} %. <br />
                  Si stop déclenché: {metrics.risk} {currencySymbol} soit{" "}
                  {metrics.riskPc} %.
                  <br />
                  {newMetrics.rr > 0 ? (
                    <p>Risk/reward de {newMetrics.rr}</p>
                  ) : newMetrics.potential < 0 ? (
                    <p>Trade perdant</p>
                  ) : (
                    <p>Trade sans rique</p>
                  )}
                </p>
              </>
            )}
          </div>

          <form
            className={styles.form_reEnter}
            onSubmit={handleSubmit}
            method="POST "
          >
            <label className={styles.label} htmlFor="target">
              target (postion)
            </label>
            <div className={styles.input_wrap}>
              <input
                type="number"
                id="target"
                name="target"
                min="0"
                step="0.001"
                value={values.target}
                onChange={handleChange}
              />{" "}
              {currencySymbol} à {newMetrics.targetAtPc || metrics.targetAtPc} %
              du cours.
            </div>

            <label className={styles.label} htmlFor="stop">
              stop (postion)
            </label>
            <div className={styles.input_wrap}>
              {" "}
              <input
                type="number"
                id="stop"
                name="stop"
                min="0"
                step="0.001"
                value={values.stop}
                onChange={handleChange}
              />{" "}
              {currencySymbol} à {newMetrics.riskAtPc || metrics.riskAtPc} % du
              cours.
            </div>

            {trade &&
              values &&
              (+trade.stop !== +values.stop ||
                +trade.target !== +values.target) &&
              newMetrics.valid && (
                <div>
                  Avec les nouvelles valeurs, <br />
                  Si objectif ralié : {newMetrics.potential} {currencySymbol}{" "}
                  soit {newMetrics.potentialPc} % <br />
                  Si stop déclenché,
                  {newMetrics.risk < 0 ? (
                    <span> perte de </span>
                  ) : (
                    <span> gain de </span>
                  )}
                  {newMetrics.risk} {currencySymbol} soit {newMetrics.riskPc} %.
                  <br />
                  {newMetrics.rr > 0 ? (
                    <p>Risk/reward de {newMetrics.rr}</p>
                  ) : newMetrics.potential < 0 ? (
                    <p>Trade perdant</p>
                  ) : (
                    <p>Trade sans rique</p>
                  )}
                </div>
              )}

            {trade &&
              values &&
              (+trade.stop !== +values.stop ||
                +trade.target !== +values.target) &&
              !newMetrics.valid && <p> sasie invalide</p>}

            {/* --------------------------------- début perfMeter --------------- */}
            <div className={` ${styleMeter.wrapper_meter}`}>
              <div
                className={`${styleMeter.alertInvalid} ${
                  meterInvalid ? styleMeter.alertVisible : ""
                } `}
              >
                <div className={`${styleMeter.alertInvalid_content} `}>
                  {" "}
                  Stop ou TP invalide{" "}
                </div>
              </div>

              <div
                className={`${styleMeter.meter_container} ${
                  meterInvalid ? styleMeter.opacify : ""
                }`}
              >
                <PerfMeter
                  legend={
                    metrics.balance > 0
                      ? `Gain actuel : ${metrics.balance} ${currencySymbol} `
                      : `Perte actuelle : ${metrics.balance} ${currencySymbol} `
                  }
                  min={newMetrics.valid ? newMetrics.risk : metrics.risk}
                  max={
                    newMetrics.valid ? newMetrics.potential : metrics.potential
                  }
                  perf={metrics.balance}
                  meterWidth={styles.meterWidth}
                  meterHeight={styles.meterHeight}
                />
              </div>
            </div>
            {/* --------------------------------fin perfMeter --------------- */}

            <textarea
              id="comment"
              name="comment"
              value={values.comment}
              onChange={handleChange}
              rows="2"
            />

            <label className={styles.label} htmlFor="date">
              date
            </label>
            <div className={styles.input_wrap}>
              <input
                type="date"
                id="date"
                name="date"
                value={values.date}
                onChange={handleChange}
              ></input>
            </div>

            <div className={styles.full_width}>
              <NavLink
                className={`${styles.action}`}
                to={{
                  pathname: `/portfolio/${portfolioId}/ajust/${previousTradeId}`,
                }}
                state={{
                  portfolioId: portfolioId,
                  tradesIdArray: tradesIdArray,
                }}
              >
                {`Prev`}
              </NavLink>
              <BtnCancel value="Abandon" action={cancelEnter} name="abandon" />
              <BtnSubmit value="Validation" name="validation" />
              <NavLink
                className={`${styles.action}`}
                to={{
                  pathname: `/portfolio/${portfolioId}/ajust/${nextTradeId}`,
                }}
                state={{
                  portfolioId: portfolioId,
                  tradesIdArray: tradesIdArray,
                }}
              >
                {`Next`}
              </NavLink>
            </div>
          </form>
        </main>
      )}
    </>
  );
}

export default Adjust;
