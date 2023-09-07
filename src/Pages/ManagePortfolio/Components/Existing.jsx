import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDepositFundsMutation,
  useIdlePortfolioMutation,
} from "../../../store/slice/tradeApi.js";
import styles from "./existing.module.css";
import BtnCancel from "../../../Components/UI/BtnCancel";
import BtnSubmit from "../../../Components/UI/BtnSubmit";
import Modal from "../../../Components/Modal/Index";
import {
  validateAddRemoveFunds,
  validateIdlePortfolio,
} from "./validateInputsExisting.js";

function Existing({ portfolios, isLoading, setManageExisting }) {
  const navigate = useNavigate();

  // devise liée au portefeuille
  const [currency, setCurrency] = useState("");
  const [status, setStatus] = useState("");

  // actions
  const initActions = [
    { id: 0, title: "choisissez" },
    { id: 1, title: "ajouter des fonds" },
    { id: 2, title: "retirer des fonds" },
    { id: 3, title: "désactiver" },
  ];
  const [actions, setActions] = useState(initActions);

  // Mutation pour créer un deposit (dépot ou retrait)
  const [deposit, { isError: depositError }] = useDepositFundsMutation();
  // pour passer portfolio en idle:
  const [idlePortfolio, { data, isError }] = useIdlePortfolioMutation();

  const initValues = {
    portfolioId: null,
    action: null,
    amount: 0,
  };
  const [values, setValues] = useState(initValues);

  // set du portif de base -> le premier des portfolios
  useEffect(() => {
    if (portfolios) {
      const toSet = +portfolios[0].id;
      setValues({
        ...values,
        portfolioId: toSet,
      });
    }
    // eslint-disable-next-line
  }, [portfolios]);

  // set des devises sur choix liste déroulante
  useEffect(() => {
    if (!isLoading && values.portfolioId !== null) {
      let { currency, status } = portfolios.find(
        (portfolio) => +portfolio.id === +values.portfolioId
      );
      setCurrency(currency);
      setStatus(status);
      if (status === "idle") {
        actions.splice(3, 1, { id: 3, title: "activer" });
        setActions([...actions]);
      }
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

  // État local pour stocker les erreurs du formulaire
  const [errorsInForm, setErrorsInForm] = useState([]);

  // gestion de la soumission du formulaire ///////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (+values.action === 1 || +values.action === 2) {
      // Appel de la fonction de traitement des données du formulaire
      const { inputErrors, verifiedValues = {} } = validateAddRemoveFunds(
        values,
        portfolios
      );
      if (inputErrors.length > 0) {
        setErrorsInForm(inputErrors);
      } else {
        try {
          await deposit(verifiedValues);
          setValues(initValues);
          setManageExisting(false);
          navigate(`/portfolio/manage`);
        } catch (err) {
          console.log(depositError);
        }
      }
    } else if (+values.action === 3) {
      const { inputErrors, verifiedValues = {} } = validateIdlePortfolio(
        values,
        portfolios
      );
      if (inputErrors.length > 0) {
        setErrorsInForm(inputErrors);
      } else {
        const infos = { id: verifiedValues.portfolioId, status: status };
        try {
          idlePortfolio(infos)
            .unwrap()
            .then(console.log("data.msg", data))
            .catch((err) => console.log(err, isError))

          setValues(initValues);
          setManageExisting(false);

          navigate(`/portfolio/manage`);
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      cancel();
    }
  };

  const cancel = () => {
    setValues(initValues);
    setManageExisting(false);
  };
  // Fonction pour réinitialiser les erreurs du formulaire après une tentative de soumission
  const afterError = () => {
    setErrorsInForm([]);
  };

  return (
    <div className={styles.existing}>
      <h2>Agir sur portefeuille existant</h2>
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

        <p className={styles.infos}>
          {" "}
          ce portefeuille est en {currency} et il est{" "}
          {status === "active" ? "actif" : "inactif"}.
        </p>

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
            <BtnCancel value="Abandon" action={cancel} name="abandon" />
            <BtnSubmit value="Validation" name="validation" />
          </div>
        ) : (
          <div className={styles.btns}>
            <BtnCancel value="Abandon" action={cancel} name="abandon" />
          </div>
        )}
      </form>
    </div>
  );
}

export default Existing;
