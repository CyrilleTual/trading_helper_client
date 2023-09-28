import { useEffect, useState } from "react";
import styles from "./reEnter.module.css";
import BtnSubmit from "../../Components/UI/BtnSubmit";
import BtnCancel from "../../Components/UI/BtnCancel";
import { validate } from "./validateInputsReEnter";
import { useReEnterMutation } from "../../store/slice/tradeApi";
import Modal from "../../Components/Modal/Index";

function ReEnterCore({ trade, afterProcess }) {
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

  // hook de création de la reEnter
  const [reEnter] = useReEnterMutation();

  /////  set des valeurs initiales //////////////////////////////
  useEffect(() => {
    if (trade) {
      setValues({
        ...values,
        target: trade.target,
        stop: trade.stop,
        comment: trade.currentComment,
      });
    }
    // eslint-disable-next-line
  }, [trade]);

  // prise en charge du changement de valeur des inputs 
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // State pour la validation des erreurs 
  const [errorsInForm, setErrorsInForm] = useState([]);

  // prise en chage de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Appel de la fonction de validation des données du formulaire
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
        trade_id: +trade.tradeId,
        stock_id: +trade.stockId,
      };
      try {
        // appel de la mutation de re-enter
        const resp = await reEnter(datas);
          setValues({
            ...values,
            target: trade.target,
            stop: trade.stop,
            comment: trade.currentComment,
            quantity: 0,
            price: 0,
            fees: 0,
            tax: 0,
            date: new Date().toISOString().split("T")[0],
          });

        console.log(resp);
        // appel de la call-back aprés traitement du formulaire 
        afterProcess();
        
      } catch (err) {
        console.log(err);
      }
    }
  };

  // caalback de nettoyage des erreurs 
  const afterError = () => {
    setErrorsInForm([]);
  };

  // Callback pour cancel  
  function cancelEnter() {
      setValues({
        ...values,
        target: trade.target,
        stop: trade.stop,
        comment: trade.currentComment,
        quantity: 0,
        price: 0,
        fees: 0,
        tax: 0,
        date: new Date().toISOString().split("T")[0],
      });
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
    </>
  );
}

export default ReEnterCore;
