import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import styles from "./create.module.css";
import {
  useGetCurrenciesQuery,
  useNewPortfolioMutation,
  useGetPortfoliosByUserQuery,
} from "../../../store/slice/tradeApi";
import BtnCancel from "../../../Components/UI/BtnCancel";
import BtnSubmit from "../../../Components/UI/BtnSubmit";
import Modal from "../../../Components/Modal/Index";
import { validate } from "./validateInputsCreate.js"

function Create({ setCreate }) {
  // Récupération de l'ID de l'utilisateur
  const userId = useSelector((state) => state.user.infos.id);

  // Récupération des devises
  const { data: currencies, isSuccess } = useGetCurrenciesQuery();

  // Récupération des portfolios de l'utilisateur /////////////////
  const { data: portfolios } = useGetPortfoliosByUserQuery(userId);

  // Mutation pour créer un nouveau portfolio /////////////////////
  const [createPortfolio] = useNewPortfolioMutation();

  // Valeurs initiales du formulaire //////////////////////////////
  const initials = {
    title: "",
    comment: "",
    deposit: 0,
    currencyAbbr: "",
  };

  const [values, setValues] = useState(initials);

  // Initialisation  de la liste des devises après récupération des données
  useEffect(() => {

    if (isSuccess) {
      const toset = currencies[0].abbr;
      setValues({ ...values, currencyAbbr: toset });
    }
    // eslint-disable-next-line
  }, [currencies]);

  // Gestion du changement de valeur dans les champs du formulaire
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Fonction pour créer un nouveau portfolio avec les données fournies
  const go = async (datas) => {
    try {
      await createPortfolio(datas);
      setValues({ ...values, ...initials });
      setCreate(false);
    } catch (err) {
      console.log(err);
    }
  };

  // État local pour stocker les erreurs du formulaire
  const [errorsInForm, setErrorsInForm] = useState([]);

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    

    // Appel de la fonction de traitement des données du formulaire
    const { inputErrors, verifiedValues } = validate(
      values,
      currencies,
      portfolios
    );

    if (inputErrors.length > 0) {
      setErrorsInForm(inputErrors);
    } else {
      const datas = {
        title: verifiedValues.title,
        comment: verifiedValues.comment,
        deposit: verifiedValues.deposit,
        currency_abbr: verifiedValues.currencyAbbr,
        user_id: +userId,
        status: "active",
      };
      go(datas);
    }
  };

  // Fonction pour annuler la création d'un nouveau portfolio
  const cancel = () => {
    setValues({ ...values, ...initials });
    setCreate(false);
  };

  // Fonction pour réinitialiser les erreurs du formulaire après une tentative de soumission
  const afterError = () => {
    setErrorsInForm([]);
  };

  return (
    <>
      <h2>Création d'un nouveau portefeuille</h2>
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

      {isSuccess && (
        <form
          className={styles.form_create}
          onSubmit={handleSubmit}
          method="POST "
        >
          <label htmlFor="title">désignation</label>

          <div className={styles.input_wrap}>
            <input
              type="text"
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
            />
          </div>

          <label htmlFor="comment">commentaires</label>

          <div className={styles.input_wrap}>
            <input
              type="text"
              id="comment"
              name="comment"
              value={values.comment}
              onChange={handleChange}
            />
          </div>

          <label htmlFor="deposit">solde initial</label>

          <div className={styles.input_wrap_initAmout}>
            <input
              type="number"
              id="deposit"
              name="deposit"
              min="0"
              value={values.deposit}
              onChange={handleChange}
            />
            <select
              onChange={handleChange}
              id="currencyAbbr"
              name="currencyAbbr"
              value={values.currencyAbbr}
            >
              {currencies.map((currency, i) => (
                <option key={i} value={currency.abbr}>
                  {currency.abbr}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.btns}>
            <BtnCancel value="Abandon" action={cancel} name="abandon" />
            <BtnSubmit value="Validation" name="validation" />
          </div>
        </form>
      )}
    </>
  );
}

export default Create;
