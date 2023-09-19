import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
import  PerfMeter from "./../../Components/PerfMeter/Index"

function Adjust() {
  const navigate = useNavigate();
  const { tradeId } = useParams();

  // va recupérer les infos du trade
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
  });

  // nouveaux metriques 
  const [newMetrics, setNewMetrics] = useState({
    valid: true,
    potential: 0,
    potentialPc: 0,
    risk: 0,
    riskPc: 0,
    rr: 0,
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
  ///// gestion du formulaire //////////////////////////////
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
  useEffect (() =>{
    if (isSuccess) {
      calculNewMetrics(trade, values, newMetrics, setNewMetrics);
    }
    // eslint-disable-next-line
  }, [values]); 








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
                <p>
                  Portefeuille {trade.portfolio}, {trade.title}
                </p>
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
                  de {metrics.balance} {currencySymbol} soit {(metrics.balancePc).toFixed(2)}{" "}
                  % .
                  <br />
                  Actuellement, objectif : {trade.target} {currencySymbol} et
                  stop {trade.stop} {currencySymbol}
                  <br />
                  Si objectif ralié: {metrics.potential} {currencySymbol} soit{" "}
                  {metrics.potentialPc} %. <br />
                  Si stop déclanché: {metrics.risk} {currencySymbol} soit{" "}
                  {metrics.riskPc} %.
                  <br />
                  {metrics.rr > 0 && <span>Risk/reward de {metrics.rr}</span>}
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
              {currencySymbol}
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
              {currencySymbol}
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
                  Si stop déclanché,
                  {newMetrics.risk < 0 ? (
                    <span> perte de </span>
                  ) : (
                    <span> gain de </span>
                  )}
                  {newMetrics.risk} {currencySymbol} soit {(newMetrics.riskPc)} %.
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

            <div className={styles.meter_container}>
              <PerfMeter
                legend={
                  metrics.balance > 0
                    ? `Gain actuel : ${metrics.balance} ${currencySymbol} `
                    : `Perte actuelle : ${metrics.balance} ${currencySymbol} `
                }
                min={newMetrics.valid ? newMetrics.risk : metrics.risk}
                max={newMetrics.valid ? newMetrics.potential: metrics.potential}
                perf={metrics.balance}
                meterWidth={styles.meterWidth}
                meterHeight={styles.meterHeight}
              />
            </div>

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
              <BtnCancel value="Abandon" action={cancelEnter} name="abandon" />
              <BtnSubmit value="Validation" name="validation" />
            </div>
          </form>
        </main>
      )}
    </>
  );
}

export default Adjust;
