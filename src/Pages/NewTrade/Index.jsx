import React from "react";
import { useSelector } from "react-redux";
import {
  useGetPortfoliosByUserQuery,
  useGetStategiesByUserIdQuery,
  useLastQuoteQuery,
  useNewTradeMutation,
} from "../../store/slice/tradeApi";
import { useState, useEffect } from "react";
import styles from "./newTrade.module.css";
import SearchStock from "./Components/SearchStock";

function NewTrade() {
  // un new trade va automatiquement créer une entrée
  // pas de trade sans entrée

  // on va chercher la liste des portfolios de l'user
  // const { id, alias } = useSelector((state) => ({
  //   ...state.user.infos,
  // }));
  const id = useSelector((state) => state.user.infos.id);
  const alias = useSelector((state) => state.user.infos.alias);

  // le titre selectionné
  const [selectedItem, setSelectedItem] = useState({
    id: 0,
    title: "",
    isin: "",
    place: "",
    ticker: "",
  });

  // on va recupere la liste des portfolios de l'user ->
  const { data: portfolios, isLoading: portfolioIsLoading } =
    useGetPortfoliosByUserQuery(id);
  // listes des strategies de l'user
  const { data: strategies, isLoading: stategiesIsLoading } =
    useGetStategiesByUserIdQuery(id);
  // dernier cotation
  const { data: lastInfos, isSuccess: lastIsSuccess } =
    useLastQuoteQuery(selectedItem);
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

  useEffect(() => {
    if (!portfolioIsLoading && !stategiesIsLoading) {
      const toSet = portfolios[0].id;

      const toSet2 = strategies[0].id;
      setValues({ ...values, portfolioId: toSet, strategyId: toSet2 });

      // let { currency, currencyId } = portfolios.find(
      //   (portfolio) => +portfolio.id === toSet
      // );

      // setCurrency(currency);
      // setCurrencyId(currencyId);
    }
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
  }, [values.portfolioId]);

  ///// gestion du formulaire //////////////////////////////
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const datas = {
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
    };

    try {
      const res = await newTrade(datas);
      console.log(res);
      // navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      {portfolioIsLoading || stategiesIsLoading ? (
        <p>Loading</p>
      ) : (
        <>
          <div>Bonjour {alias} tu es parti pour de nouvelles aventures ...</div>
          <h2>Création d'un trade :</h2>
          <SearchStock
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
          {selectedItem.id !== 0 && (
            <p>
              Vous avez selectionné {selectedItem.title} qui a l'id{" "}
              {selectedItem.id}{" "}
              {lastIsSuccess && <span>dernier cours : {lastInfos.last}</span>}
            </p>
          )}

          <form className={styles.form} onSubmit={handleSubmit} method="POST ">
            <label className={styles.label} htmlFor="price">
              Price
            </label>
            <input
              type="price"
              id="price"
              name="price"
              value={values.price}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="target">
              target
            </label>
            <input
              type="target"
              id="target"
              name="target"
              value={values.target}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="stop">
              stop
            </label>
            <input
              type="stop"
              id="stop"
              name="stop"
              value={values.stop}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="quantity">
              quantity
            </label>
            <input
              type="quantity"
              id="quantity"
              name="quantity"
              value={values.quantity}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="fees">
              fees
            </label>
            <input
              type="fees"
              id="fees"
              name="fees"
              value={values.fees}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="tax">
              tax
            </label>
            <input
              type="tax"
              id="tax"
              name="tax"
              value={values.tax}
              onChange={handleChange}
            />
            <label className={styles.label} htmlFor="comment">
              comment
            </label>
            <input
              type="comment"
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
                <option
                  key={i}
                  value={portfolio.id}
                  // selected={portfolio.id === values.portfolioId ? true : false}
                >
                  {portfolio.title}
                </option>
              ))}
            </select>
            {values.portfolioId}
            <p>
              ce portefeuille est en {currency} devise {currencyId}
            </p>
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
            {values.strategyId}
            <br />
            <input type="submit" value="Validation" /> <br />
          </form>
        </>
      )}
    </div>
  );
}

export default NewTrade;
