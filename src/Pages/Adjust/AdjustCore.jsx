import { useEffect, useState } from "react";
import { useAdjustmentMutation } from "../../store/slice/tradeApi";
import { validate } from "./validateInputsAdjust";
import { calculNewMetrics } from "./metrics.js";
import BtnCancel from "../../Components/UI/BtnCancel";
import PerfMeter from "../../Components/PerfMeter/Index";
import BtnSubmit from "../../Components/UI/BtnSubmit";
import styles from "./adjust.module.css";
import styleMeter from "../../Components/PerfMeter/perfMeter.module.css";
import Modal from "../../Components/Modal/Index";
import ProgressBar from "../../Components/ProgressBar/Index.jsx"


function AdjustCore({ trade, afterProcess }) {
       
  // valeurs initiales de l'ajustement
  const [values, setValues] = useState({
    date: new Date().toISOString().split("T")[0],
    comment: "",
    target: 0,
    stop: 0,
  });
  ///// calcul des valeurs  initiales ////////////////
  useEffect(() => {
    if (trade) {
      setValues({
        ...values,
        price: trade.lastQuote,
        target: trade.target,
        stop: trade.stop,
        comment: trade.currentComment,
        position: trade.position,
      });
    }
    // eslint-disable-next-line
  }, [trade]);

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

  const reset = () =>{
     setValues({
       ...values,
       target: trade.target,
       stop: trade.stop,
       comment: trade.currentComment,
       date: new Date().toISOString().split("T")[0],
     });
  }

  // hook d'ajustement
  const [adjustment] = useAdjustmentMutation();
  // calcul avec les nouveaux paramèrtes
  useEffect(() => {
    if ( trade) {
      calculNewMetrics(trade, values, newMetrics, setNewMetrics);
    }
    // eslint-disable-next-line
  }, [values, trade]);

  // variable pour invalider la jauge
  const [meterInvalid, setMeterInvalid] = useState(false);
  useEffect(() => {
    newMetrics.valid === false ? setMeterInvalid(true) : setMeterInvalid(false);
  }, [newMetrics]);

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
        trade_id: +trade.tradeId,
        stock_id: +trade.stockId,
      };
      try {
        const resp = await adjustment(datas);
        console.log(resp);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        afterProcess();
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
    reset();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
     afterProcess();
  }
 

  return (
    <>
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
          {trade.symbol} à {newMetrics.targetAtPc || trade.targetAtPc} % du
          cours.
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
          {trade.symbol} à {newMetrics.riskAtPc || trade.riskAtPc} % du cours.
        </div>

        {trade &&
          values &&
          (+trade.stop !== +values.stop || +trade.target !== +values.target) &&
          newMetrics.valid && (
            <div>
              Avec les nouvelles valeurs, <br />
              Si objectif ralié : {newMetrics.potential} {trade.symbol} soit{" "}
              {newMetrics.potentialPc} % <br />
              Si stop déclenché,
              {newMetrics.risk < 0 ? (
                <span> perte de </span>
              ) : (
                <span> gain de </span>
              )}
              {newMetrics.risk} {trade.symbol} soit {newMetrics.riskPc} %.
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
          (+trade.stop !== +values.stop || +trade.target !== +values.target) &&
          !newMetrics.valid && <p> sasie invalide</p>}

        <ProgressBar
          stop={values.stop}
          target={values.target}
          now={trade.lastQuote.toFixed(2)}
          symbol={trade.symbol}
          targetAtPc={
            newMetrics.valid ? newMetrics.targetAtPc : trade.targetAtPc
          }
          riskAtPc={newMetrics.valid ? newMetrics.riskAtPc : trade.riskAtPc}
          meterInvalid={meterInvalid}
          neutral={trade.neutral}
          position={trade.position}
          tradeQuote={trade.tradeQuote}
          status={trade.status}
          pru={
            trade.position === "long"
              ? trade.pru.toFixed(2)
              : trade.neutral.toFixed(2)
          }
        />

        {/* --------------------------------- début perfMeter --------------- */}
        <div className={` ${styleMeter.wrapper_meter} ${styles.local_wrapper}`}>
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
            className={`${styles.adjust_page} ${styleMeter.meter_container} ${
              meterInvalid ? styleMeter.opacify : ""
            }`}
          >
            <PerfMeter
              legend={
                trade.balance > 0
                  ? `Gain actuel : ${trade.balance} ${trade.symbol} `
                  : `Perte actuelle : ${trade.balance} ${trade.symbol} `
              }
              min={newMetrics.valid ? newMetrics.risk : trade.risk}
              max={newMetrics.valid ? newMetrics.potential : trade.potential}
              perf={trade.balance}
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
          <BtnCancel value="Abandon" action={cancelEnter} name="abandon" />
          <BtnSubmit
            value="Validation"
            name="validation"
            style={{}}
            disabled={
              (+trade.stop !== +values.stop ||
                +trade.target !== +values.target) &&
              newMetrics.valid
                ? ``
                : "disabled"
            }
          />
        </div>
      </form>
    </>
  );
}

export default AdjustCore;
