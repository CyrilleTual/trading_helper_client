import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  useReEnterMutation,
  useGetTradesActivesByUserQuery
} from "../../store/slice/tradeApi";
import styles from "./reEnter.module.css";
import { Loading } from "../../Components/Loading/Index";
import BtnSubmit from "../../Components/UI/BtnSubmit";
import BtnCancel from "../../Components/UI/BtnCancel";
import Modal from "../../Components/Modal/Index";
import { validate } from "./validateInputsReEnter";
import {calculMetrics} from "../../utils/calculateTradeMetrics"



function ReEnter() {
  const navigate = useNavigate();
  const { tradeId } = useParams();

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
  const {
    data: originalsTrades,
    isSuccess,
  } = useGetTradesActivesByUserQuery(id);

  // on complète les données du trade par les valeurs calculèes -> trade
  useEffect(() => {
    if (isSuccess) {
      const { tradeFull } = calculMetrics(
        originalsTrades.filter((trade) => +trade.tradeId === +tradeId)[0]
      );
      setTrade({ ...tradeFull });
    }
    // eslint-disable-next-line
  }, [isSuccess]);
  //////////////////////////////////////////////////////////////////////////////////////////////////

  // hook de création de la reEnter
  const [reEnter] = useReEnterMutation();

  // valeurs de la nouvelle prise de position
  const [values, setValues] = useState({
    quantity: 0,
    price: 0,
    fees: 0,
    tax: 0,
    date: new Date().toISOString().split("T")[0],
    comment: "",
    target: 0,
    stop: 0,
  });
  ///// gestion du formulaire //////////////////////////////
  useEffect(() => {
    if (isSuccess && trade) {
      setValues({
        ...values,
        target: trade.target,
        stop: trade.stop,
        comment: trade.currentComment,
      });
    }
    // eslint-disable-next-line
  }, [trade]);

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
        price: verifiedValues.price,
        target: verifiedValues.target,
        stop: verifiedValues.stop,
        quantity: verifiedValues.quantity,
        fees: verifiedValues.fees,
        tax: verifiedValues.fees,
        comment: verifiedValues.comment,
        trade_id: +tradeId,
        stock_id: +trade.stockId,
      };
      try {
        const resp = await reEnter(datas);
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

  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {!isSuccess || !trade || isVisitor ? (
        <Loading />
      ) : (
        <main className={styles.re_enter}>
          <h1>Re-enter</h1>
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
                  Portefeuille {trade.portfolio}, renforcer sur {trade.title} ?
                </p>
                <p>
                  C'est un trade {trade.position}, le dernier cours est à{" "}
                  {trade.lastQuote} {trade.symbol}.
                </p>
                <p>
                  Le PRU actuel est de {trade.pru} {trade.symbol} pour une ligne
                  de {trade.enterQuantity - trade.closureQuantity} titres.
                </p>
              </>
            )}
          </div>

          <form
            className={styles.form_reEnter}
            onSubmit={handleSubmit}
            method="POST "
          >
            <label className={styles.label} htmlFor="price">
              niveau d'entrée:
            </label>
            <div className={styles.input_wrap}>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.001"
                value={values.price}
                onChange={handleChange}
                autoFocus
              />{" "}
              {trade.symbol}
            </div>

            <label className={styles.label} htmlFor="quantity">
              quantité :
            </label>
            <div className={styles.input_wrap}>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={values.quantity}
                onChange={handleChange}
              />
            </div>

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
              {trade.symbol}
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
              {trade.symbol}
            </div>

            <label className={styles.label} htmlFor="fees">
              commissions
            </label>
            <div className={styles.input_wrap}>
              <input
                type="number"
                id="fees"
                name="fees"
                min="0"
                step="0.001"
                value={values.fees}
                onChange={handleChange}
              />{" "}
              {trade.symbol}
            </div>

            <label className={styles.label} htmlFor="tax">
              taxes
            </label>
            <div className={styles.input_wrap}>
              <input
                type="number"
                id="tax"
                name="tax"
                min="0"
                step="0.001"
                value={values.tax}
                onChange={handleChange}
              />{" "}
              {trade.symbol}
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

export default ReEnter;
