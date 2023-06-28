import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePrepareQuery, useReEnterMutation } from "../../store/slice/tradeApi";
import styles from "./reEnter.module.css";
 

function ReEnter() {
  const { tradeId } = useParams();

  // va recupérer les infos du trade
  const { data: trade, isLoading, isSuccess } = usePrepareQuery(tradeId);

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
      setValues({ ...values, target: trade.target, stop: trade.stop, comment:trade.comment });
    }
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
      console.log("datas à traiter", datas);
      const resp = await reEnter(datas);
      console.log(resp);
      navigate (`/portfolio/detail/${trade.portfolio_id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!isSuccess ? (
        <p>Loading</p>
      ) : (
        <main className={styles.re_enter}>
          <h1>Re-enter</h1>
          <div className="comments">
            <p>
              Portefeuille {trade.portfolio}, renforcer sur {trade.title}?
            </p>
            <p>
              C'est un {trade.position}, le dernier cours est à{" "}
              {trade.lastQuote}.
            </p>
            <p>
              Le PRU actuel est de {trade.pru} pour une ligne de{" "}
              {trade.remains} titres.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} method="POST ">
            <label className={styles.label} htmlFor="price">
              Niveau d'entrée:
            </label>
            <input
              type="price"
              id="price"
              name="price"
              value={values.price}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="quantity">
              quantité :
            </label>
            <input
              type="quantity"
              id="quantity"
              name="quantity"
              value={values.quantity}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="target">
              target (postion)
            </label>
            <input
              type="target"
              id="target"
              name="target"
              value={values.target}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="stop">
              stop (postion)
            </label>
            <input
              type="stop"
              id="stop"
              name="stop"
              value={values.stop}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="fees">
              commissions
            </label>
            <input
              type="fees"
              id="fees"
              name="fees"
              value={values.fees}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="tax">
              taxes
            </label>
            <input
              type="tax"
              id="tax"
              name="tax"
              value={values.tax}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="comment">
              comment (position)
            </label>
            <input
              type="comment"
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
