import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  usePrepareQuery,
  useReEnterMutation,
  useGetPortfoliosByUserQuery,
} from "../../store/slice/tradeApi";
import styles from "./reEnter.module.css";
import { Loading } from "../../Components/Loading/Index";
import BtnSubmit from "../../Components/UI/BtnSubmit";
import BtnCancel from "../../Components/UI/BtnCancel";
import Modal from "../../Components/Modal/Index";
import { validate } from "./validateInputsReEnter";

function ReEnter() {
  const navigate = useNavigate();
  const { tradeId } = useParams();

  // va recupérer les infos du trade
  const { data: trade, isSuccess } = usePrepareQuery(tradeId);

  // on se sert des portfolios pour obtenir le symbole des currencies
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const { data: portfolios, isSuccess: isSuccess1 } =
    useGetPortfoliosByUserQuery(useSelector((state) => state.user.infos.id));

  useEffect(() => {
    if (trade && portfolios) {
      let { symbol } = portfolios.find(
        (portfolio) => portfolio.title === trade.portfolio
      );
      setCurrencySymbol(symbol);
    }
  }, [trade, portfolios]);

  // hook de création de la reEnter
  const [reEnter] = useReEnterMutation();

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
    if (isSuccess) {
      setValues({
        ...values,
        target: trade.target,
        stop: trade.stop,
        comment: trade.comment,
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
         stock_id: +trade.stock_id,
       };
       try {
         const resp = await reEnter(datas);
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
                  {trade.lastQuote} {currencySymbol}.
                </p>
                <p>
                  Le PRU actuel est de {trade.pru} {currencySymbol} pour une
                  ligne de {trade.remains} titres.
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
              {currencySymbol}
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
              {currencySymbol}
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
              {currencySymbol}
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
