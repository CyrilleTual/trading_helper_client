import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetTradesActivesByUserQuery,
  useExitProcessMutation,
} from "../../store/slice/tradeApi";
import { resetStorage } from "../../utils/tools";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../store/slice/user";
import styles from "./exitTrade.module.css";
import BtnSubmit from "../../Components/UI/BtnSubmit";
import BtnCancel from "../../Components/UI/BtnCancel";
import Modal from "../../Components/Modal/Index";
import { Loading } from "../../Components/Loading/Index";
import { validate } from "./validateInputsExit";
import { calculMetrics } from "../../utils/calculateTradeMetrics"; 

function ExitTrade() {
  const { tradeId } = useParams();

  // va recupérer les infos du trade
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
  const { data: originalsTrades, isSuccess, isError } =
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
  }, [isSuccess]);
  //////////////////////////////////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isError) {
      resetStorage();
      dispatch(signOut());
      navigate("/");
    }
    // eslint-disable-next-line
  }, [isError]);

  // hook de création de sortie
  const [exitProcess] = useExitProcessMutation();

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
        trade_id: +tradeId,
        remains: +trade.enterQuantity - trade.closureQuantity,
        stock_id: trade.stockId,
      };
      try {
        await exitProcess(datas);
        navigate(`/portfolio/${trade.portfolioId}/`);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const afterError = () => {
    setErrorsInForm([]);
  };

  const cancelExit = () => {
    navigate(`/portfolio/${trade.portfolioId}/detail`);
  };

  //*******************************************************
  return (
    <main className={styles.exit}>
      {!isSuccess || !trade || isVisitor ? (
        <Loading />
      ) : (
        <>
          <h1>Exit</h1>
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

          <p>
            Dans le poretefeuille "{trade.portfolio}" tu veux vendre{" "}
            {trade.title}?{" "}
          </p>
          <p>Le dernier cours est de {trade.lastQuote}</p>
          <p>
            Tu disposes de {trade.enterQuantity - trade.closureQuantity} titres
            en portefeuille
          </p>

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
    </main>
  );
}

export default ExitTrade;
