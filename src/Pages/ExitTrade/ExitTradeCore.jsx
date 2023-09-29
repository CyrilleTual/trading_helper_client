import { useState } from "react";
import styles from "./exitTrade.module.css";
import BtnSubmit from "../../Components/UI/BtnSubmit";
import BtnCancel from "../../Components/UI/BtnCancel";
import Modal from "../../Components/Modal/Index";
import { Loading } from "../../Components/Loading/Index";
import { validate } from "./validateInputsExit";
import { useExitProcessMutation } from "../../store/slice/tradeApi";

function ExitTradeCore({ trade, afterProcess }) {
  const [values, setValues] = useState({
    quantity: 0,
    price: 0,
    fees: 0,
    tax: 0,
    date: new Date().toISOString().split("T")[0],
    comment: "",
  });

  // hook de création de sortie
  const [exitProcess] = useExitProcessMutation();

  // gestion du changement de valeur des inputs
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Gére la validation du formulaire /////////////////////////////
  const [errorsInForm, setErrorsInForm] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Appel de la fonction de traitement des données du formulaire
    const { inputErrors, verifiedValues = {} } = validate(
      values,
      +trade.enterQuantity - trade.closureQuantity
    );

    if (inputErrors.length > 0) {
      setErrorsInForm(inputErrors);
    } else {
      const datas = {
        comment: verifiedValues.comment,
        date: verifiedValues.date,
        fees: verifiedValues.fees,
        price: verifiedValues.price,
        quantity: verifiedValues.quantity,
        tax: verifiedValues.fees,
        trade_id: trade.tradeId,
        remains: +trade.enterQuantity - trade.closureQuantity,
        stock_id: trade.stockId,
      };
      try {
        await exitProcess(datas);
        setValues({
          quantity: 0,
          price: 0,
          fees: 0,
          tax: 0,
          date: new Date().toISOString().split("T")[0],
          comment: "",
        });
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

  const cancelExit = () => {
    setValues({
      quantity: 0,
      price: 0,
      fees: 0,
      tax: 0,
      date: new Date().toISOString().split("T")[0],
      comment: "",
    });
     window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    afterProcess();
  };

  return (
    <>
      {!trade ? (
        <Loading />
      ) : (
        <>
          {errorsInForm.length > 0 && (
            <Modal
              display={
                <>
                  <p>
                    Validation du formulaire impossible : <br />
                    {errorsInForm.map((error, j) => (
                      <span key={j}>
                        {error}
                        <br />
                      </span>
                    ))}
                  </p>
                </>
              }
              action={afterError}
            />
          )}

          <form
            className={styles.form_exit}
            onSubmit={handleSubmit}
            method="POST "
          >
            <label className={styles.label} htmlFor="price">
              Price
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
              />
            </div>

            <label className={styles.label} htmlFor="quantity">
              quantity
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

            <label className={styles.label} htmlFor="fees">
              fees
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
              />
            </div>

            <label className={styles.label} htmlFor="tax">
              tax
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
              />
            </div>

            <label className={styles.label} htmlFor="comment">
              comment
            </label>
            <div className={styles.input_wrap}>
              {" "}
              <input
                type="text"
                id="comment"
                name="comment"
                value={values.comment}
                onChange={handleChange}
              />
            </div>

            <label className={styles.label} htmlFor="date">
              date
            </label>
            <div className={styles.input_wrap}>
              {" "}
              <input
                type="date"
                id="date"
                name="date"
                value={values.date}
                onChange={handleChange}
              ></input>
            </div>

            <div className={styles.full_width}>
              <BtnCancel value="Abandon" action={cancelExit} name={"abandon"} />
              <BtnSubmit value="Validation" name="validation" />
            </div>
          </form>
        </>
      )}
    </>
  );
}

export default ExitTradeCore;
