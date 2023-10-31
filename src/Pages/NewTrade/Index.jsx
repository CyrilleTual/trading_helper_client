import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../../store/slice/user";
import {
  useCheckIfActiveTradeQuery,
  useGetPortfoliosByUserQuery,
  useGetStategiesByUserIdQuery,
  useLastQuoteQuery,
  useNewTradeMutation,
} from "../../store/slice/tradeApi";
import SearchStock from "./Components/SearchStock";
import ExistingTrade from "./Components/ExistingTrade";
import BtnSubmit from "../../Components/UI/BtnSubmit";
import BtnCancel from "../../Components/UI/BtnCancel";
import Modal from "../../Components/Modal/Index";
import { Loading } from "../../Components/Loading/Index";
import { resetStorage } from "../../utils/tools";
import { validate } from "./validateInputs";
import styles from "./newTrade.module.css";

function NewTrade() {
  const navigate = useNavigate();
  const [reset, setReset] = useState(false);

  // un new trade va automatiquement créer une entrée
  // pas de trade sans entrée

  // Recherche les paramètres de l'utilisateur ////////////////////
  const id = useSelector((state) => state.user.infos.id);
  // liste des portfolios de l'utilisateur
  const {
    data: portfolios,
    isLoading: portfolioIsLoading,
    isSuccess: isSuccess1,
    isError: isError1,
  } = useGetPortfoliosByUserQuery(id);
  // listes des strategies de l'utilisateur
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
  } = useLastQuoteQuery(selectedItem, { skip: skip2 });

  const quoteExist = () => {
    if (lastInfos) {
      if (lastInfos.currency === undefined) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  };

  // exemple de lastInfos : ///////////////////////////////////////
  // before :  37.645
  // currency :  "€"
  // id : 27
  // isin : "FR0000131906"
  // last  : 38.17
  // place : "p"
  // ticker : "RNO"
  // title : "Renault"
  /////////////////////////////////////////////////////////////////

  // nouveau trade ////////////////////////////////////////////////
  const [newTrade] = useNewTradeMutation();

  const [tradeCurrency, setTradeCurrency] = useState({
    symbol: "€",
    abbr: null,
  });

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

  const [values, setValues] = useState(initValues); // valeurs des inputs

  const [datas, setDatas] = useState({}); // valeurs a post

  //let datas = {}; // valeurs a post

  const [existingTrade, setExistingTrade] = useState(false);
  if (portfolios && strategies) {
  }

  // gère l'existance d'au moins un portefeuille //////////////////
  const [noPortfolio, setNoportfolio] = useState(false);
  useEffect(() => {
    if (quoteExist() && portfolios && portfolios.length === 0) {
      setNoportfolio(true);
    }
    // eslint-disable-next-line
  }, [lastInfos, portfolios]);

  function goCreatePortfolio() {
    cancelEnter();
    navigate("/portfolio/manage");
  }

  // gère l'existance d'un portefeuille dans la bonne devise //////
  const [noPortfolioGoodCurrency, setNoportfolioGoodCurrency] = useState(false);
  useEffect(() => {
    if (
      quoteExist() &&
      lastInfos &&
      portfolios &&
      portfolios.length > 0 &&
      !portfolios.find((portfolio) => portfolio.symbol === lastInfos.currency)
    ) {
      setNoportfolioGoodCurrency(true);
    }
    // eslint-disable-next-line
  }, [lastInfos, portfolios]);

  // gestion des listes déroulantes ////////////////////////////////
  useEffect(() => {
    // if (
    //   (lastInfos && portfolios && portfolios.length === 0) ||
    //   !(
    //     lastInfos &&
    //     portfolios.length > 0 &&
    //     portfolios.find((portfolio) => portfolio.symbol === lastInfos.currency)
    //   )
    // ) {
    // } else {
    if (
      lastInfos &&
      quoteExist() &&
      portfolios.length > 0 &&
      portfolios.find((portfolio) => portfolio.symbol === lastInfos.currency) &&
      //!portfolioIsLoading &&
      //!stategiesIsLoading &&
      !isError1 &&
      !isError2
    ) {
      // valeurs par defaut des listes déroulantes
      setValues({
        ...values,
        position: "long", // long par défaut
        portfolioId: portfolios.find(
          (portfolio) => portfolio.symbol === lastInfos.currency
        ).id, // premier portfolio dans la bonne devise,
        strategyId: strategies[0].id, // première stratégie de l'utilisateur
        price: lastInfos.last,
      });
       
    }
    // }

    // eslint-disable-next-line
  }, [
    lastInfos,
    selectedItem,
    portfolioIsLoading,
    stategiesIsLoading,
    portfolios,
    strategies,
    reset,
  ]);

  // Set de la devise du trade /////////////////////////////
  useEffect(() => {
    if (
      portfolios &&
      portfolios.length > 0 &&
      !!portfolios.find((portfolio) => +portfolio.id === +values.portfolioId) &&
      isSuccess1
    ) {
      let {symbol, abbr } = portfolios.find(
        (portfolio) => +portfolio.id === +values.portfolioId
      );
      setTradeCurrency({
        ...tradeCurrency,
        symbol: symbol,
        abbr: abbr,
      });
     

    }
    // eslint-disable-next-line
  }, [values.portfolioId, portfolios]);

  // Recherche d'un éventuel doublon (même stock et même portfolio)
  const [skip, setSkip] = useState(true);
  const {
    data: doubleTrade,
    isSuccess: checkDoubleDone,
    isError: isError4,
  } = useCheckIfActiveTradeQuery(
    { stockId: selectedItem.id, portfolioId: +values.portfolioId },
    { skip }
  );
  useEffect(() => {
    if (checkDoubleDone) {
      if (doubleTrade.length > 0) {
        setExistingTrade(true);
      } else {
        go();
      }
    }
    // eslint-disable-next-line
  }, [doubleTrade, checkDoubleDone]);

  // gestion des erreurs / les requêtes ///////////////////////////
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

  // création effective du nouveau trade -> trade et enter ////////
  async function go() {

    if (lastInfos.currency !== tradeCurrency.symbol) {
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

  ///// gestion du formulaire //////////////////////////////
  const [errorsInForm, setErrorsInForm] = useState([]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Appel de la fonction de traitement des données du formulaire
    const { inputErrors, verifiedValues } = validate(values);

    if (inputErrors.length > 0) {
      setErrorsInForm(inputErrors);
    } else {
      // on set datas avec des données nécessaires

      setDatas({
        price: verifiedValues.price,
        target: verifiedValues.target,
        stop: verifiedValues.stop,
        quantity: verifiedValues.quantity,
        fees: verifiedValues.fees,
        tax: verifiedValues.tax,
        comment: verifiedValues.comment,
        strategy_id: verifiedValues.strategyId,
        portfolio_id: verifiedValues.portfolioId,
        position: verifiedValues.position,
        stock_id: +selectedItem.id,
        currency_abbr: tradeCurrency.abbr,
        beforeQuote: +lastInfos.before,
        lastQuote: +lastInfos.last,
      });

      



      setSkip(false); // on déclanche le middle ware existingActiveTrad
    }
  };



  const afterError = () => {
    setErrorsInForm([]);
  };

  /////// cancel enter ////////////////////////////////////////////
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
    setReset(!reset);
    setSkip(true);
    setSkip2(true);
    setNoportfolio(false);
  }

  // toDo : transformer les champs de saisie number en type texte quand pas de focus pour utiliser Intl
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

  return (
    <>
      {portfolioIsLoading || stategiesIsLoading || lastIsFetching ? (
        <Loading />
      ) : (
        <main className={`container ${styles.newTrade}`}>
          <h1>Création d'un trade :</h1>

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

          {!quoteExist() && !lastIsFetching && (
            <Modal
              display={
                <p>
                  Nous ne parvenons pas à obtenir une valorisation de cet actif{" "}
                  <br />
                  Trade impossible
                </p>
              }
              action={goOn}
            />
          )}
          {noPortfolio && (
            <Modal
              display={
                <p>
                  Vous devez créer un portefeuille avant de prendre position.
                </p>
              }
              action={goCreatePortfolio}
            />
          )}
          {noPortfolioGoodCurrency && (
            <Modal
              display={
                <p>
                  Vous devez créer un portefeuille en {lastInfos.currency} pour
                  pouvoir prendre position sur cet Actif.
                </p>
              }
              action={goCreatePortfolio}
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
                          <div className={styles.wrapper_radios}>
                            type de trade:
                            <label>
                              <input
                                type="radio"
                                name="position"
                                value="long"
                                checked={values.position === "long"}
                                onChange={handleChange}
                              />
                              {`  `}
                              long
                            </label>
                            <label>
                              <input
                                type="radio"
                                name="position"
                                value="short"
                                checked={values.position === "short"}
                                onChange={handleChange}
                              />
                              {`  `}
                              short
                            </label>
                          </div>
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
                            <BtnCancel
                              value="Abandon"
                              action={cancelEnter}
                              name="abandon"
                            />
                            <BtnSubmit value="Validation" name="validation" />
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
