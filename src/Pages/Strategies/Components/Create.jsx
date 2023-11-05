import { useSelector } from "react-redux";
import { useState } from "react";
import { validateCreation } from "./validations";
import styles from "./create.module.css";
import Modal from "../../../Components/Modal/Index";
import BtnCancel from "../../../Components/UI/BtnCancel";
import BtnSubmit from "../../../Components/UI/BtnSubmit";
import { useNewStrategyMutation } from "../../../store/slice/tradeApi";

function Create({ setCreate, strategies }) {
  // Récupération de l'ID de l'utilisateur
  const userId = useSelector((state) => state.user.infos.id);

  // Mutation de création d'une nouvelle stratégie
  const [createStrategy] = useNewStrategyMutation();

  // Valeurs initiales du formulaire //////////////////////////////
  const initials = {
    title: "",
    comment: "",
  };

  // État local pour stocker les erreurs du formulaire
  const [errorsInForm, setErrorsInForm] = useState([]);

  const [values, setValues] = useState(initials);
  // Gestion du changement de valeur dans les champs du formulaire
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Appel de la fonction de traitement des données du formulaire
    const { inputErrors, verifiedValues } = validateCreation(
      values,
      strategies
    );

    if (inputErrors.length > 0) {
      setErrorsInForm(inputErrors);
    } else {
      const datas = {
        user_id: userId,
        title: verifiedValues.title,
        comment: verifiedValues.comment,
      };
      go(datas);
    }
  };

  // Fonction pour créer une nouvelle stratégie avec les données fournies
  const go = async (datas) => {
    try {
      await createStrategy(datas);
      setValues({ ...values, ...initials });
      setCreate(false);
    } catch (err) {
      console.log(err);
    }
  };

  
  // Fonction pour annuler la création d'une stratégie
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
      <h2>Création stratégie</h2>
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

      {
        <form
          className={styles.form_create}
          onSubmit={handleSubmit}
          method="POST "
        >
          <label htmlFor="title">dénomination : </label>

          <div className={styles.input_wrap}>
            <input
              type="text"
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="3 à 50 caractères svp       "
              autoFocus
            />
          </div>

          <label htmlFor="comment">commentaires : </label>

          <div className={styles.input_wrap}>
            <input
              type="text"
              id="comment"
              name="comment"
              value={values.comment}
              onChange={handleChange}
            />
          </div>
          <div className={styles.btns}>
            <BtnCancel value="Abandon" action={cancel} name="abandon" />
            <BtnSubmit value="Validation" name="validation" />
          </div>
        </form>
      }
    </>
  );
}

export default Create;
