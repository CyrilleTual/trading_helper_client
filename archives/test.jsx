import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { useSignUserUpMutation } from "../../store/slice/tradeApi";
import style from "./index.module.css";
import logo from "../../assets/img/logo.jpg";
import BtnLink from "../../Components/UI/BtnLink";

function SignUp() {
  const navigate = useNavigate();

  // Vérifie si l'utilisateur est connecté et redirige vers le tableau de bord en cas de connexion
  const isLogged = useSelector((state) => state.user.isLogged);
  useEffect(() => {
    if (isLogged) {
      navigate("/global");
    }
  }, [isLogged]);

  // Middleware pour la mutation de création de compte via le store
  const [signUserUp, result] = useSignUserUpMutation();

  const [inputs, setInputs] = useState({
    email: "",
    alias: "",
    pwd: "",
    confirmPwd: "",
    agree: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [myError, setMyError] = useState(null);

  // Gestion de la visibilité du mot de passe
  const [type, setType] = useState("password");
  const [type2, setType2] = useState("password");
  const [icon, setIcon] = useState(faEyeSlash);
  const [icon2, setIcon2] = useState(faEyeSlash);

  // Fonction pour basculer la visibilité du mot de passe
  const handleToggle = (position) => {
    if (position === "first") {
      if (type === "password") {
        setIcon(faEye);
        setType("text");
      } else {
        setIcon(faEyeSlash);
        setType("password");
      }
    }
    if (position === "second") {
      if (type2 === "password") {
        setIcon2(faEye);
        setType2("text");
      } else {
        setIcon2(faEyeSlash);
        setType2("password");
      }
    }
  };

  // Gestion des changements dans le formulaire
  const { email, alias, pwd, confirmPwd, agree } = inputs;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };
  const handleAgreeChange = () => {
    setInputs({ ...inputs, agree: !agree });
  };

  /// Fonction d'envoi du formulaire

  async function handleSubmit() {
    const dataToSend = {
      email: inputs.email,
      pwd: inputs.pwd,
      alias: inputs.alias,
    };

    signUserUp(dataToSend)
      .unwrap()
      .then((res) => navigate("/")) // Utilisateur créé avec succès
      .catch((error) => {
        if (error.status === 422) {
          setInputs({ ...inputs, email: "" });
          setMyError(error.status);
        }
        if (error.status === 500) {
          setMyError(error.status);
        }
      });
  }

  // Fonction de validation du formulaire, retourne les erreurs
  const validateForm = (inputs) => {
    const errors = {};
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;
    if (!inputs.email) {
      errors.email = "Veuillez entrer votre adresse email";
    } else if (!emailRegex.test(inputs.email)) {
      errors.email = "Format de l'adresse email invalide";
    }
    if (!inputs.alias) {
      errors.alias = "Veuillez entrer un nom d'utilisateur";
    }
    if (!inputs.pwd) {
      errors.pwd = "Veuillez entrer votre mot de passe";
    }
    if (!inputs.confirmPwd) {
      errors.confirmPwd = "Veuillez confirmer votre mot de passe";
    } else if (inputs.pwd !== inputs.confirmPwd) {
      errors.confirmPwd = "Attention, les mots de passe ne correspondent pas";
    }
    if (inputs.agree !== true) {
      errors.agree = "Veuillez accepter les conditions d'utilisation";
    }
    return errors;
  };

  // Gestion de la soumission du formulaire
  const handleSignUp = async (e) => {
    e.preventDefault();
    // Définir le drapeau qui sera vérifié dans le useEffect
    setIsSubmit(true);
    // Valider les données du formulaire
    setFormErrors(validateForm(inputs));
  };

  // Tenter d'envoyer le formulaire si tout est correct
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      handleSubmit();
    }
  }, [formErrors, isSubmit]);

  return (
    <main className={style.signup}>
      <img src={logo} alt="Logo" />
      <h1>Création de compte</h1>
      <p>
        {myError === 422 && (
          <p>Un compte existe déjà avec cette adresse e-mail</p>
        )}
        {myError === 500 && (
          <p>Une erreur est survenue lors de la création de votre compte</p>
        )}
      </p>
      <form onSubmit={handleSignUp}>
        <label htmlFor="email">Adresse email :</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleInputChange}
        />
        <p>{formErrors.email}</p>

        <label htmlFor="alias">Nom d'utilisateur :</label>
        <input
          type="text"
          name="alias"
          autoComplete="username"
          id="alias"
          value={alias}
          onChange={handleInputChange}
        />
        <p>{formErrors.alias}</p>

        <label htmlFor="pwd">Mot de passe :</label>
        <div className={style.parentOfPwd}>
          <input
            type={type}
            autoComplete="new-password"
            name="pwd"
            id="pwd"
            value={pwd}
            onChange={handleInputChange}
          />
          <span className={style.eye} onClick={() => handleToggle("first")}>
            <FontAwesomeIcon icon={icon} />
          </span>
        </div>
        <p>{formErrors.pwd}</p>
        
        <label htmlFor="confirmPwd">Confirmez le mot de passe :</label>
        <div className={style.parentOfPwd}>
          <input
            type={type2}
            name="confirmPwd"
            id="confirmPwd"
            value={confirmPwd}
            onChange={handleInputChange}
          />
          <span className={style.eye} onClick={() => handleToggle("second")}>
            <FontAwesomeIcon icon={icon2} />
          </span>
        </div>
        <p>{formErrors.confirmPwd}</p>

        <label className={style.labelCheck} htmlFor="agree">
          <input
            type="checkbox"
            name="agree"
            id="agree"
            checked={agree}
            onChange={handleAgreeChange}
          />
          <span className={style.space}> </span> J'accepte les Conditions d'utilisation
        </label>
        <p>{formErrors.agree}</p>

        <input type="submit" value="S'inscrire" />
      </form>
      <p>
        <BtnLink link="/" title="Accueil" />
      </p>
    </main>
  );
}

export default SignUp;
