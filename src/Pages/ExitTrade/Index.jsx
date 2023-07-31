import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  usePrepareQuery,
  useExitProcessMutation,
} from "../../store/slice/tradeApi";
import { resetStorage } from "../../utils/tools";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../store/slice/user";
import styles from "./exitTrade.module.css";

function ExitTrade() {
  const { tradeId } = useParams();

  // va recupérer les infos du trade
  const {
    data: trade,
    isLoading,
    isSuccess,
    isError,
  } = usePrepareQuery(tradeId);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isError) {
      resetStorage();
      dispatch(signOut());
      navigate("/");
    }
  }, [isError]);

  // hook de création de sortie
  const [exitProcess] = useExitProcessMutation();

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

  ///// gestion du formulaire //////////////////////////////

  /// to do -> verifier que l'on est bien sur le bon trade
  /// -> tradeId === trade.tradeId ?
  const [values, setValues] = useState({
    quantity: 0,
    price: 0,
    fees: 0,
    tax: 0,
    date: new Date().toISOString().split("T")[0],
    comment: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datas = {
      trade_id: tradeId,
      price: +(+values.price).toFixed(2),
      quantity: +(+values.quantity).toFixed(0),
      remains: trade.remains,
      fees: +(+values.fees).toFixed(3),
      tax: +(+values.fees).toFixed(3),
      date: values.date,
      comment: values.comment,
      stock_id: trade.stock_id,
    };

    try {
      await exitProcess(datas);
      navigate(-2);
    } catch (err) {
      console.log(err);
    }
  };

  //*******************************************************
  return (
    <main className={styles.exit}>
      {!isSuccess ? (
        <p>Loading</p>
      ) : (
        <>
          <h1>Exit</h1>
          <p>
            Dans le poretefeuille "{trade.portfolio}" tu veux vendre {trade.title}?{" "}
          </p>
          <p>Le dernier cours est de {trade.lastQuote}</p>
          <p>Tu disposes de {trade.remains} titres en portefeuille</p>
        

          <form className={styles.form} onSubmit={handleSubmit} method="POST ">
            <label className={styles.label} htmlFor="price">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.001"
              value={values.price}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="quantity">
              quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={values.quantity}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="fees">
              fees
            </label>
            <input
              type="number"
              id="fees"
              name="fees"
              min="0"
              step="0.001"
              value={values.fees}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="tax">
              tax
            </label>
            <input
              type="number"
              id="tax"
              name="tax"
              min="0"
              step="0.001"
              value={values.tax}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="comment">
              comment
            </label>
            <input
              type="text"
              id="comment"
              name="comment"
              value={values.comment}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="date">
              date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={values.date}
              onChange={handleChange}
            ></input>
            <br />
            <input type="submit" value="Validation" /> <br />
          </form>
        </>
      )}
    </main>
  );
}

export default ExitTrade;
