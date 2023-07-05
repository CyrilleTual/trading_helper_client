import React, { useEffect, useState } from "react";

import styles from "../managePortfolio.module.css";

function Existing({portfolios, isLoading}) {

      // formulaire
    const [currency, setCurrency] = useState("euro");
    const [currencyId, setCurrencyId] = useState(1);

    const [values, setValues] = useState({
      portfolioId: 1,
      action: null,
      amout: 0,
    });

    const actions = [{id:0, title: "Choisissez"},
              {id:1, title: "ajouter des fonds"}, 
              {id:2,title:"retirer des fonds"},
              {id:3,title:"désactiver un compte"}]

    // set des devises

     useEffect(() => {
       if (!isLoading) {
         let { currency, currencyId } = portfolios.find(
           (portfolio) => +portfolio.id === +values.portfolioId
         );
         setCurrency(currency);
         setCurrencyId(currencyId);
       }
     }, [values.portfolioId]);

    useEffect(() => {
      if (!isLoading ) {
        // valeurs par defaut des listes déroulantes
        const toSet = portfolios[0].id;
        setValues({ ...values, portfolioId: toSet });
      }
    }, [
      isLoading,
    ]);

      const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
      };






  return (
    <div>
      <form action="">
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

        <label className={styles.label} htmlFor="action">
          Choisissez une action
        </label>
        <select
          onChange={handleChange}
          id="action"
          name="action"
          defaultValue={values.action}
        >
          {actions.map((action, i) => (
            <option key={i} value={action.id}>
              {action.title}
            </option>
          ))}
        </select>

        <p>{values.action}</p>
        {+values.action === 1 && <p>Combien voulez-vous verser ?</p>}
        {+values.action === 2 && <p>Combien voulez-vous retirer ?</p>}
        {(+values.action === 1 || +values.action === 2) && (
          <input
            type="number"
            id="amout"
            name="amout"
            value={values.amout}
            onChange={handleChange}
            min="0"
          />
        )}
      </form>
    </div>
  );
}

export default Existing