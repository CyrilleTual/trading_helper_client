import React, { useEffect, useState } from "react";
import styles from "./existing.module.css";
import BtnCancel from "../../../Components/UI/BtnCancel";
import BtnSubmit from "../../../Components/UI/BtnSubmit";

function Existing({ portfolios, isLoading }) {
  // formulaire
  const [currency, setCurrency] = useState("");

  const [values, setValues] = useState({
    portfolioId: null,
    action: null,
    amout: 0,
  });

  const actions = [
    { id: 0, title: "choisissez" },
    { id: 1, title: "ajouter des fonds" },
    { id: 2, title: "retirer des fonds" },
    { id: 3, title: "désactiver" },
  ];

  // set du portif de base
  useEffect(() => {
    if (portfolios) {
      const toSet = portfolios[0].id;
      setValues({
        ...values,
        portfolioId: toSet,
      });
    }
  }, [portfolios]);

  // set des devises sur choix liste déroulante
  useEffect(() => {
    if (!isLoading && values.portfolioId !== null) {
      let { currency } = portfolios.find(
        (portfolio) => +portfolio.id === +values.portfolioId
      );
      setCurrency(currency);
    }
    // eslint-disable-next-line
  }, [values.portfolioId]);

  useEffect(() => {
    if (!isLoading) {
      // valeurs par defaut des listes déroulantes
      const toSet = portfolios[0].id;
      setValues({ ...values, portfolioId: toSet });
    }
    // eslint-disable-next-line
  }, [isLoading]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const cancel = () => {
    console.log("action canceled");
  };

  return (
    <div className={styles.existing}>
      <h2>Agir sur portefeuille existant</h2>
      <form className={styles.form_existing} action="">
        <label htmlFor="portfolioId">portefeuille</label>
        <div className={styles.select_wrap}>
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
        </div>

        <p className={styles.infos}> ce portefeuille est en {currency}</p>

        <label htmlFor="action">action</label>
        <div className={styles.select_wrap}>
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
        </div>

        {(+values.action === 1 || +values.action === 2) && (
          <>
            <label className={styles.label} htmlFor="amout">
              {+values.action === 1 && <p>montant à verser</p>}
              {+values.action === 2 && <p>montant à retirer</p>}
            </label>
            <div className={styles.select_wrap}>
              <input
                type="number"
                id="amout"
                name="amout"
                value={values.amout}
                onChange={handleChange}
                min="0"
              />
            </div>
          </>
        )}

        {+values.action === 3 || +values.amout > 0 ? (
          <div className={styles.btns}>
            <BtnCancel value="Abandon" action={cancel} />
            <BtnSubmit value="Validation" />
          </div>
        ) : (
          <div className={styles.btns}>
            <BtnCancel value="Abandon" action={cancel} />
          </div>
        )}
      </form>
    </div>
  );
}

export default Existing;
