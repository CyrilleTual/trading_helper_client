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
    <main className={`container ${styles.newTrade}`}>
      <h1>Création d'un trade :</h1>
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
                {lastIsSuccess && (
                  <span>, dernier cours : {lastInfos.last}</span>
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
                  />
                  <label className={styles.label} htmlFor="quantity">
                    quantité
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
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
                      <option
                        key={i}
                        value={portfolio.id}
                        // selected={portfolio.id === values.portfolioId ? true : false}
                      >
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
                  <input type="submit" value="Validation" /> <br />
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}

export default NewTrade;
