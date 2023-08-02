
import { useSelector, useDispatch } from "react-redux";
import {
  useCheckIfActiveTradeQuery,
  useGetPortfoliosByUserQuery,
  useGetStategiesByUserIdQuery,
  useLastQuoteQuery,
  useNewTradeMutation,
} from "../../store/slice/tradeApi";
import { useState, useEffect } from "react";
import styles from "./newTrade.module.css";
import SearchStock from "./Components/SearchStock";
import BtnCancel from "../../Components/UI/BtnCancel";
import { useNavigate } from "react-router-dom";
import ExistingTrade from "./Components/ExistingTrade";
import { signOut } from "../../store/slice/user";
import { resetStorage } from "../../utils/tools";

function NewTrade() {
  const navigate = useNavigate();
  // un new trade va automatiquement créer une entrée
  // pas de trade sans entrée

  // on va chercher la liste des portfolios de l'user
  // const { id, alias } = useSelector((state) => ({
  //   ...state.user.infos,
  // }));
  const id = useSelector((state) => state.user.infos.id);
  const alias = useSelector((state) => state.user.infos.alias);

  // le titre selectionné
  const initSelected = {
    id: 0,
    title: "",
    isin: "",
    place: "",
    ticker: "",
  };
  const [selectedItem, setSelectedItem] = useState(initSelected);

  // on va recupere la liste des portfolios de l'user ->
  const {
    data: portfolios,
    isLoading: portfolioIsLoading,
    isError: isError1,
  } = useGetPortfoliosByUserQuery(id);
  // listes des strategies de l'user
  const {
    data: strategies,
    isLoading: stategiesIsLoading,
    isError: isError2,
  } = useGetStategiesByUserIdQuery(id);

  // derniere cotation le skip2 retarde la requete tant que pas de selection 
  const [skip2, setSkip2] = useState(true);
  useEffect(() => {
    if(selectedItem.id !== 0) {
          setSkip2(false)
    }
  }, [selectedItem]);

  const { data: lastInfos, isSuccess: lastIsSuccess } = useLastQuoteQuery(
    selectedItem,
    { skip: skip2 }
  );

  // nouveau trade
  const [newTrade] = useNewTradeMutation();

  const [currency, setCurrency] = useState("euro");
  const [currencyId, setCurrencyId] = useState(1);
  const [values, setValues] = useState({
    price: 0,
    target: 0,
    stop: 0,
    quantity: 0,
    fees: 0,
    tax: 0,
    comment: "",
    strategyId: 1,
    portfolioId: 1,
  });
  const [datas, setDatas] = useState({});
  const [existingTrade, setExistingTrade] = useState(false);

  // gestion des listes déroulantes 
  useEffect(() => {
    if (!portfolioIsLoading && !stategiesIsLoading && !isError1 && !isError2) {
      // valeurs par defaut des listes déroulantes
      const toSet = portfolios[0].id;
      const toSet2 = strategies[0].id;
      setValues({ ...values, portfolioId: toSet, strategyId: toSet2 });
    }
  // eslint-disable-next-line
  }, [
    selectedItem,
    portfolioIsLoading,
    stategiesIsLoading,
    portfolios,
    strategies,
  ]);

  useEffect(() => {
    if (!portfolioIsLoading && !stategiesIsLoading) {
      let { currency, currencyId } = portfolios.find(
        (portfolio) => +portfolio.id === +values.portfolioId
      );
      setCurrency(currency);
      setCurrencyId(currencyId);
    }
    // eslint-disable-next-line
  }, [values.portfolioId]);

  const [skip, setSkip] = useState(true); // pour recherche des doublons
  // rechercher d'un trade existant actif (même stock et même portfolio)
  const {
    data,
    isSuccess,
    isError: isError4,
  } = useCheckIfActiveTradeQuery(
    { stockId: selectedItem.id, portfolioId: +values.portfolioId },
    { skip }
  );

  // gestion des erreurs / les requêtes
  const dispatch = useDispatch();
  useEffect(() => {
    if (isError1 || isError2 || isError4) {
      console.log(isError1, isError2, isError4);
      resetStorage();
      // on reset le state
      dispatch(signOut());
      navigate("/");
    }
    // eslint-disable-next-line
  }, [isError1, isError2, isError4]);

  // création effective du nouveau trade -> trade et enter
  async function go() {
    try {
      const res = await newTrade(datas);
      console.log(res); // on va sur le portefeuille : portfolioID
      navigate(`/portfolio/detail/${datas.portfolio_id}`);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      if (data.length > 0) {
        console.log("trade exisant");
        setExistingTrade(true);
      } else {
        go();
      }
    }
    // eslint-disable-next-line
  }, [data, isSuccess]);

  ///// gestion du formulaire //////////////////////////////
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDatas({
      ...datas,
      stock_id: selectedItem.id,
      price: +(+values.price).toFixed(2),
      target: +(+values.target).toFixed(2),
      stop: +(+values.stop).toFixed(2),
      quantity: +(+values.quantity).toFixed(0),
      fees: +(+values.fees).toFixed(3),
      tax: +(+values.fees).toFixed(3),
      comment: values.comment,
      strategy_id: +values.strategyId,
      portfolio_id: +values.portfolioId,
      currency_id: currencyId,
      lastQuote: lastInfos.last,
      beforeQuote: lastInfos.before,
    });

    // verification si le trade exite deja -> stockId / portfolio
    // on déclanche le middle ware existingActiveTrade
    setSkip(false);

    // try {
    //   const res = await newTrade(datas);
    //   console.log(res); // on va sur le portefeuille : portfolioID
    //   navigate(`/portfolio/${datas.portfolio_id}`);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  /////// cancel enter
  function cancelEnter() {
    setSelectedItem(initSelected);
    setSkip(true);
    setSkip2(true);
  }

 

  return (
    <main className={`container ${styles.newTrade}`}>
      <h1>Création d'un trade :</h1>
      {existingTrade ? (
        <ExistingTrade />
      ) : (
        <>
          {portfolioIsLoading || stategiesIsLoading ? (
            <p>Loading</p>
          ) : (
            <div>
              <p>Bonjour {alias} tu es parti pour de nouvelles aventures ...</p>
              {!selectedItem.id && (
                <SearchStock
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              )}

              {selectedItem.id !== 0 && (
                <>
                  <p>
                    Vous avez selectionné {selectedItem.title}
                    {lastIsSuccess && lastInfos.last && (
                      <span>
                        , dernier cours : {lastInfos.last} {lastInfos.currency}
                      </span>
                    )}
                  </p>

                  <div className={styles.form_enter}>
                    <form
                      className={styles.form}
                      onSubmit={handleSubmit}
                      method="POST "
                    >
                      <label className={styles.label} htmlFor="price">
                        prix
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
                      <label className={styles.label} htmlFor="target">
                        target
                      </label>
                      <input
                        type="number"
                        id="target"
                        name="target"
                        value={values.target}
                        onChange={handleChange}
                        min="0"
                        step="0.001"
                      />
                      <label className={styles.label} htmlFor="stop">
                        stop-loss
                      </label>
                      <input
                        type="number"
                        id="stop"
                        name="stop"
                        value={values.stop}
                        onChange={handleChange}
                        step="0.001"
                      />
                      <label className={styles.label} htmlFor="quantity">
                        quantité
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
                        commentaires
                      </label>
                      <input
                        type="text"
                        id="comment"
                        name="comment"
                        value={values.comment}
                        onChange={handleChange}
                      />
                      <label className={styles.label} htmlFor="portfolioId">
                        Choisissez un portefeuille
                      </label>
                      <select
                        onChange={handleChange}
                        id="portfolioId"
                        name="portfolioId"
                        defaultValue={values.portfolioId}
                      >
                        {portfolios.map((portfolio, i) => (
                          <option key={i} value={portfolio.id}>
                            {portfolio.title}
                          </option>
                        ))}
                      </select>
                      <p>ce portefeuille est en {currency}</p>
                      <label className={styles.label} htmlFor="strategyId">
                        Choisissez une strategies
                      </label>
                      <select
                        onChange={handleChange}
                        id="strategyId"
                        name="strategyId"
                        defaultValue={values.strategyId}
                      >
                        {strategies.map((strategy, i) => (
                          <option key={i} value={strategy.id}>
                            {strategy.title}
                          </option>
                        ))}
                      </select>
                      <br />
                      <input type="submit" value="Validation" />
                      <BtnCancel value="Abandon" action={cancelEnter} />
                    </form>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default NewTrade;
