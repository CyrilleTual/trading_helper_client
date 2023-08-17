import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDepositFundsMutation,
  useIdlePortfolioMutation,
} from "../../../store/slice/tradeApi.js";
import styles from "./existing.module.css";
import BtnCancel from "../../../Components/UI/BtnCancel";
import BtnSubmit from "../../../Components/UI/BtnSubmit";

function Existing({ portfolios, isLoading, setManageExisting }) {
  const navigate = useNavigate();

  // formulaire
  const [currency, setCurrency] = useState("");

  // pour créer un deposit
  const [deposit, { isError : depositError}] = useDepositFundsMutation();
  // pour passer portfolio en idle:
  const [idlePortfolio, {data, isError}] = useIdlePortfolioMutation();

  const initValues = {
    portfolioId: null,
    action: null,
    amount: 0,
  };
  const [values, setValues] = useState(initValues);

  const actions = [
    { id: 0, title: "choisissez" },
    { id: 1, title: "ajouter des fonds" },
    { id: 2, title: "retirer des fonds" },
    { id: 3, title: "désactiver" },
  ];

  // set du portif de base -> le premier des portfolios
  useEffect(() => {
    if (portfolios) {
      const toSet = +portfolios[0].id;
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
    setValues({ ...values, [e.target.name]: +e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (+values.action === 1 || +values.action === 2) {
      try {
        const res = await deposit(values);
        navigate(`/portfolio/manage`);
      } catch (err) {
        console.log(depositError);
      }
    }else if (+values.action === 3 ){
      try {
        idlePortfolio(+values.portfolioId);
        console.log(data.msg);
        navigate(`/portfolio/manage`);
      } catch (err) {
        console.log(isError);
      }
      
    }
  };

  const cancel = () => {
    setValues(initValues);
    setManageExisting(false);
  };

  return (
    <div className={styles.existing}>
      <h2>Agir sur portefeuille existant</h2>
      <form className={styles.form_existing} onSubmit={handleSubmit}>
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
              <option key={i} value={+action.id}>
                {action.title}
              </option>
            ))}
          </select>
        </div>

        {(+values.action === 1 || +values.action === 2) && (
          <>
            <label className={styles.label} htmlFor="amount">
              {+values.action === 1 && <p>montant à verser</p>}
              {+values.action === 2 && <p>montant à retirer</p>}
            </label>
            <div className={styles.select_wrap}>
              <input
                type="number"
                id="amount"
                name="amount"
                value={values.amount}
                onChange={handleChange}
                min="0"
              />
            </div>
          </>
        )}

        {+values.action === 3 || +values.amount > 0 ? (
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
