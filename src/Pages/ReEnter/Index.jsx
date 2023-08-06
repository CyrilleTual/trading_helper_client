import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePrepareQuery, useReEnterMutation } from "../../store/slice/tradeApi";
import styles from "./reEnter.module.css";
import { Loading } from "../../Components/Loading/Index";
 

function ReEnter() {
  const { tradeId } = useParams();

  // va recupérer les infos du trade
  const { data: trade, isSuccess } = usePrepareQuery(tradeId);

  // hook de création de la reEnter
  const [reEnter] = useReEnterMutation()


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

  const navigate =useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datas = {
      trade_id: tradeId,
      date: values.date,
      price: +(+values.price).toFixed(2),
      target: +(+values.target).toFixed(3),
      stop: +(+values.stop).toFixed(3),
      quantity: +(+values.quantity).toFixed(0),
      fees: +(+values.fees).toFixed(3),
      tax: +(+values.fees).toFixed(3),
      comment: values.comment,
      stock_id: trade.stock_id,
    };

    try {
      const resp = await reEnter(datas);
      console.log(resp);
      navigate (`/portfolio/${trade.portfolio_id}/detail`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!isSuccess ? (
        <Loading/>
      ) : (
        <main className={styles.re_enter}>
          <h1>Re-enter</h1>
          <div className="comments">
            <p>
              Portefeuille {trade.portfolio}, renforcer sur {trade.title} ?
            </p>
            <p>
              C'est un trade {trade.position}, le dernier cours est à{" "}
              {trade.lastQuote}.
            </p>
            <p>
              Le PRU actuel est de {trade.pru} pour une ligne de {trade.remains}{" "}
              titres.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} method="POST ">
            <label className={styles.label} htmlFor="price">
              niveau d'entrée:
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
              quantité :
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={values.quantity}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="target">
              target (postion)
            </label>
            <input
              type="number"
              id="target"
              name="target"
              min="0"
              step="0.001"
              value={values.target}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="stop">
              stop (postion)
            </label>
            <input
              type="number"
              id="stop"
              name="stop"
              min="0"
              step="0.001"
              value={values.stop}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="fees">
              commissions
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
              taxes
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
              commentaire (position)
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
        </main>
      )}
    </>
  );
}

export default ReEnter;
