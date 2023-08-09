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
import { Loading } from "../../Components/Loading/Index";
import BtnSubmit from "../../Components/UI/BtnSubmit";
import Modal from "../../Components/Modal/Index";

function NewTrade() {
  const navigate = useNavigate();

  // un new trade va automatiquement créer une entrée
  // pas de trade sans entrée

  const [reset, setReset] = useState(false);

  // on va chercher les paramètres de l'user  //////////////////////
  const id = useSelector((state) => state.user.infos.id);
  // liste des portfolios
  const {
    data: portfolios,
    isLoading: portfolioIsLoading,
    isSuccess: isSuccess1,
    isError: isError1,
  } = useGetPortfoliosByUserQuery(id);
  // listes des strategies
  const {
    data: strategies,
    isLoading: stategiesIsLoading,
    isError: isError2,
  } = useGetStategiesByUserIdQuery(id);

  // le titre selectionné , la selection se fait dans le composant SearchStock
  // qui reçoit en props selectedItemet et  setSelectedItem
  const initSelected = {
    id: 0,
    title: "",
    isin: "",
    place: "",
    ticker: "",
  };
  const [selectedItem, setSelectedItem] = useState(initSelected);
  // derniere cotation (skip2 retarde la requete tant que pas de selection)
  const [skip2, setSkip2] = useState(true);
 

  // quand le titre est selectionné -> recherhche des infos du titre 
  useEffect(() => {
    if (selectedItem.id !== 0) {
      setSkip2(false);
    }
  }, [selectedItem]);

  const {
    data: lastInfos,
    isFetching: lastIsFetching,
    isSuccess: lastIsSuccess,
    isError: lastIsError,
  } = useLastQuoteQuery(selectedItem, { skip: skip2 });



// exemple de lastInfos : ////////////////////////
// before :  37.645
// currency :  "€"
// id : 27
// isin : "FR0000131906"
// last  : 38.17
// place : "p"
// ticker : "RNO"
// title : "Renault"
//////////////////////////////////////////////////

  // nouveau trade
  const [newTrade] = useNewTradeMutation();
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState("€");
  const [currencyAbbr, setCurrencyAbbr] = useState(null);
  const [currencyId, setCurrencyId] = useState(1);

  const initValues = {
    price: 0,
    target: 0,
    stop: 0,
    quantity: 0,
    fees: 0,
    tax: 0,
    comment: "",
    strategyId: 1,
    portfolioId: 1,
    position: "long",
   
  };
  const [values, setValues] = useState(initValues);


  const [datas, setDatas] = useState({});
  const [existingTrade, setExistingTrade] = useState(false);

  // gestion des listes déroulantes
  useEffect(() => {
    if (!portfolioIsLoading && !stategiesIsLoading && !isError1 && !isError2) {
      // valeurs par defaut des listes déroulantes
      const toSet = portfolios[0].id;
      const toSet2 = strategies[0].id;
      setValues({
        ...values,
        position: "long",
        portfolioId: toSet,
        strategyId: toSet2,
      });
    }
    // eslint-disable-next-line
  }, [
    selectedItem,
    portfolioIsLoading,
    stategiesIsLoading,
    portfolios,
    strategies,
    reset,
  ]);

 

  useEffect(() => {
    if (!portfolioIsLoading && !stategiesIsLoading && isSuccess1) {
      let { currency, currencyId, symbol, abbr } = portfolios.find(
        (portfolio) => +portfolio.id === +values.portfolioId
      );
      setCurrency(currency);
      setCurrencyId(currencyId);
      setCurrencySymbol(symbol);
      setCurrencyAbbr(abbr);
    }
    // eslint-disable-next-line
  }, [values.portfolioId, portfolios]);

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
    if (lastInfos.currency !== currencySymbol) {
      cancelEnter();
      return;
    } else {
      try {
        await newTrade(datas);
        // on va sur le portefeuille : portfolioID
        navigate(`/portfolio/${datas.portfolio_id}/detail`);
      } catch (err) {
        console.log(err);
      }
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
      position: values.position,
      currency_id: currencyId,
      lastQuote: lastInfos.last,
      beforeQuote: lastInfos.before,
    });

    // verification si le trade exite deja -> stockId / portfolio
    // on déclanche le middle ware existingActiveTrade
    setSkip(false);
  };

  /////// cancel enter
  function cancelEnter() {
    setSelectedItem(initSelected);
    setValues({
      ...values,
      price: 0,
      target: 0,
      stop: 0,
      quantity: 0,
      fees: 0,
      tax: 0,
      comment: "",
    });
    setCurrency(null);
    setReset(!reset);
    setSkip(true);
    setSkip2(true);
  }

  // toDo : transformer les champs de saisie en type texte quand pas de focus pour utiliser Intl
  // if (lastIsSuccess && lastInfos.last && !lastIsFetching){
  //     let test = (new Intl.NumberFormat("fr-FR", { style: "currency", currency: `${currencyAbbr}` }).format(values.price));
  // }
  //  const formatMoney = (toFormat) => {
  //   const newInput =  (new Intl.NumberFormat("fr-FR", { style: "currency", currency: `${currencyAbbr}` }).format(toFormat));
  //   console.log ("newinput",newInput)
  //   return newInput
  // }
  ///////////////////////////////////////////////

  const symbol = () => {
    return (
      <>
        {lastIsSuccess && lastInfos.last && !lastIsFetching && (
          <span>
            {` `}
            {lastInfos.currency}
          </span>
        )}
      </>
    );
  };

  const goOn = () => {
    cancelEnter();
  };

  const sureQuoteExist = () => {
    if (lastInfos) {
      if(lastInfos.currency === undefined){
        return false
      }else{ return true}
    }return true
  }
 

  return (
    <>
      {portfolioIsLoading || stategiesIsLoading || lastIsFetching ? (
        <Loading />
      ) : (
        <main className={`container ${styles.newTrade}`}>
          <h1>Création d'un trade :</h1>
          {!sureQuoteExist() && !lastIsFetching && (
            <Modal
              display={
                <>
                  <p>
                    {" "}
                    Nous ne parvenons pas à obtenir une valorisation de cet
                    actif
                  </p>
                  <p> Trade impossible </p>
                </>
              }
              action={goOn}
            />
          )}
          {existingTrade ? (
            <ExistingTrade />
          ) : (
            <>
              {portfolioIsLoading || stategiesIsLoading ? (
                <Loading />
              ) : (
                <div>
                  {!selectedItem.id && (
                    <SearchStock
                      selectedItem={selectedItem}
                      setSelectedItem={setSelectedItem}
                    />
                  )}

                  {selectedItem.id !== 0 && portfolios && (
                    <>
                      <p>
                        Vous avez selectionné {selectedItem.title}
                        {lastIsSuccess && lastInfos.last && !lastIsFetching && (
                          <>
                            ,{` `}
                            <span className={styles.noWrap}>
                              dernier cours : {lastInfos.last}{" "}
                              {lastInfos.currency}
                            </span>
                          </>
                        )}
                      </p>

                      <div className={styles.enter}>
                        <form
                          className={styles.form_enter}
                          onSubmit={handleSubmit}
                          method="POST "
                        >
                          <label className={styles.label_wrap} htmlFor="target">
                            objectif
                          </label>
                          <div className={styles.input_wrap}>
                            {" "}
                            <input
                              type="number"
                              id="target"
                              name="target"
                              value={values.target}
                              onChange={handleChange}
                              min="0"
                              step="0.001"
                              autoFocus
                            />
                            {symbol()}
                          </div>

                          <label className={styles.label_wrap} htmlFor="stop">
                            stop-loss
                          </label>
                          <div className={styles.input_wrap}>
                            <input
                              type="number"
                              id="stop"
                              name="stop"
                              value={values.stop}
                              onChange={handleChange}
                              step="0.001"
                            />
                            {symbol()}
                          </div>

                          <label className={styles.label_wrap} htmlFor="price">
                            prix
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
                            />

                            {symbol()}
                          </div>

                          <label
                            className={styles.label_wrap}
                            htmlFor="quantity"
                          >
                            quantité
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

                          <label className={styles.label_wrap} htmlFor="fees">
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
                            />
                            {symbol()}
                          </div>

                          <label className={styles.label_wrap} htmlFor="tax">
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
                            />
                            {symbol()}
                          </div>

                          <textarea
                            id="comment"
                            name="comment"
                            value={values.comment}
                            onChange={handleChange}
                            placeholder="Ajouter ici un commentaire"
                            rows="2"
                          />

                          <label htmlFor="portfolioId">portefeuille</label>
                          <div className={styles.input_wrapLong}>
                            <select
                              onChange={handleChange}
                              id="portfolioId"
                              name="portfolioId"
                              defaultValue={values.portfolioId}
                            >
                              {lastIsSuccess &&
                              lastInfos.last &&
                              !lastIsFetching ? (
                                portfolios.map((portfolio, i) =>
                                  portfolio.symbol === lastInfos.currency ? (
                                    <option key={i} value={portfolio.id}>
                                      {portfolio.title}
                                    </option>
                                  ) : (
                                    ""
                                  )
                                )
                              ) : (
                                <option value="error">Loading....</option>
                              )}
                            </select>
                          </div>

                          <label htmlFor="position">type de trade</label>
                          <div className={styles.input_wrapLong}>
                            <select
                              onChange={handleChange}
                              id="position"
                              name="position"
                              defaultValue="long"
                            >
                              <option value="long">long</option>
                              <option value="short">short</option>
                            </select>
                          </div>

                          <label htmlFor="strategyId">strategies</label>
                          <div className={styles.input_wrapLong}>
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
                          </div>

                          <div className={styles.full_width}>
                            <BtnCancel value="Abandon" action={cancelEnter} />
                            <BtnSubmit value="Validation" />
                          </div>
                        </form>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      )}
    </>
  );
}

export default NewTrade;
