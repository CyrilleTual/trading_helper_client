import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation, NavLink } from "react-router-dom";
import {
  useGetTradesActivesByUserQuery,
 
  useAdjustmentMutation,
} from "../../store/slice/tradeApi";
import styles from "./adjust.module.css";
import { Loading } from "../../Components/Loading/Index";
import BtnSubmit from "../../Components/UI/BtnSubmit";
import BtnCancel from "../../Components/UI/BtnCancel";
import Modal from "../../Components/Modal/Index";
import { validate } from "./validateInputsAdjust";
import { calculNewMetrics } from "./metrics.js";
import PerfMeter from "../../Components/PerfMeter/Index";
import styleMeter from "../../Components/PerfMeter/perfMeter.module.css";
import { calculMetrics } from "../../utils/calculateTradeMetrics";

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


  // on check si visiteur pour adapter l'affichage //////////////////////////////////////
  const role = useSelector((state) => state.user.infos.role);
  let id = useSelector((state) => state.user.infos.id);
  let isVisitor = false;
  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
    isVisitor = true;
  }

  // Récupère le trade  ///////////////////////////////////////////////
  const [trade, setTrade] = useState(null);
  // Récupère tous les trades ouverts par id d'user (deja dans le redux store)
  const { data: originalsTrades, isSuccess } =
    useGetTradesActivesByUserQuery(id);

  // on complète les données du trade par les valeurs calculèes -> trade
  useEffect(() => {
    if (isSuccess) {
      const { tradeFull } = calculMetrics(
        originalsTrades.filter((trade) => +trade.tradeId === +tradeId)[0]
      );
      setTrade({ ...tradeFull });
    }
    // eslint-disable-next-line
  }, [tradeId, isSuccess]);
  //////////////////////////////////////////////////////////////////////////////////////////////////

 
  

  // const { data: portfolios, isSuccess: isSuccess1 } =
  //   useGetPortfoliosByUserQuery(useSelector((state) => state.user.infos.id));

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

  // hook d'ajustement
  const [adjustment] = useAdjustmentMutation();

  // valeurs initiales de l'ajustement
  const [values, setValues] = useState({
    date: new Date().toISOString().split("T")[0],
    comment: "",
    target: 0,
    stop: 0,
  });
  ///// calcul des valeurs  initiales ////////////////
  useEffect(() => {
    if (isSuccess && trade) {
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

  // calcul avec les nouveaux paramèrtes
  useEffect(() => {
    if (isSuccess && trade) {
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
        trade_id: +tradeId,
        stock_id: +trade.stockId,
      };
      try {

        const resp = await adjustment(datas);
        console.log(resp);
        navigate(`/portfolio/${trade.portfolioId}/detail`);
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
    navigate(`/portfolio/${trade.portfolioId}/detail`);
  }

  return (
    <>
      {!isSuccess  || !trade || isVisitor ? (
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
                  {trade.lastQuote} {trade.symbol}.
                </p>
                <p>
                  Le PRU est de {trade.pru} {trade.symbol} pour une ligne de{" "}
                  {trade.remains} titres. <br />
                  Ligne en{" "}
                  {trade.balance > 0 ? (
                    <span>gain</span>
                  ) : (
                    <span>perte</span>
                  )}{" "}
                  de {trade.balance} {trade.symbol} soit{" "}
                  {trade.balancePc.toFixed(2)} % .
                  <br />
                  Actuellement, objectif : {trade.target} {trade.symbol} et stop{" "}
                  {trade.stop} {trade.symbol}
                  <br />
                  Si objectif ralié: {trade.potential} {trade.symbol} soit{" "}
                  {trade.potentialPc} %. <br />
                  Si stop déclenché: {trade.risk} {trade.symbol} soit{" "}
                  {trade.riskPc} %.
                  <br />
                </p>
                {trade.rr > 0 ? (
                  <p>Risk/reward de {trade.rr}</p>
                ) : newMetrics.potential < 0 ? (
                  <p>Trade perdant</p>
                ) : (
                  <p>Trade sans rique</p>
                )}
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
              {trade.symbol} à {newMetrics.riskAtPc || trade.riskAtPc} % du
              cours.
            </div>

            {trade &&
              values &&
              (+trade.stop !== +values.stop ||
                +trade.target !== +values.target) &&
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
                    trade.balance > 0
                      ? `Gain actuel : ${trade.balance} ${trade.symbol} `
                      : `Perte actuelle : ${trade.balance} ${trade.symbol} `
                  }
                  min={newMetrics.valid ? newMetrics.risk : trade.risk}
                  max={
                    newMetrics.valid ? newMetrics.potential : trade.potential
                  }
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
