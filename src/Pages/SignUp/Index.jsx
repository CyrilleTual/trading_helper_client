import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { useSignUserUpMutation } from "../../store/slice/tradeApi";
import Modal from "../../Components/Modal/Index"
import style from "./index.module.css";
import logo from "../../assets/img/logo.jpg";
import BtnLink from "../../Components/UI/BtnLink";
import BtnSubmit from "../../Components/UI/BtnSubmit";

// Composant de demande de création de compte
function SignUp() {
  const navigate = useNavigate()

  // Pour modal de consfirmation
  const [displayModalOk, setDisplayModalOk] = useState(false);
  const goOn = () => navigate("/global");

  // Vérifie si l'utilisateur est connecté et redirige vers le tableau de bord en cas de connexion active
  const islogged = useSelector((state) => state.user.isLogged);
  useEffect(() => {
    if (islogged) {
      navigate("/global");
    }
  }, [islogged]);

  // middlware pour le set de la state via le store
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

  // Gestion de la visibilité du mot de passe (champs pwd et pwd confirm)
  const [type, setType] = useState("password");
  const [type2, setType2] = useState("password");
  const [icon, setIcon] = useState(faEyeSlash);
  const [icon2, setIcon2] = useState(faEyeSlash);
  // Fonction pour basculer la visibilité du mot de passe et changer l'icone associée
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

  /// fonction d'envoi du formulaire
  async function go() {
    const datas = {
      email: inputs.email,
      pwd: inputs.pwd,
      alias: inputs.alias,
    };

    signUserUp(datas)
      .unwrap()
      .then(() => setDisplayModalOk(true) )
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

  // Fonction de valisation du formulaire retourne les erreurs
  const validate = (inputs) => {
    const errors = {};
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;
    if (!inputs.email) {
      errors.email = "Veuillez entrer votre email";
    } else if (!regex.test(inputs.email)) {
      errors.email = "Format email invalide";
    }
    if (!inputs.alias) {
      errors.alias = "Veuillez entrer un nom utilisateur";
    }
    if (!inputs.pwd) {
      errors.pwd = "Veuillez entrer votre mot de passe";
    }
    if (!inputs.confirmPwd) {
      errors.confirmPwd = "Veuillez confirmer votre mot de passe";
    } else if (inputs.pwd !== inputs.confirmPwd) {
      errors.confirmPwd = "Attention erreur de confirmation";
    }
    if (inputs.agree !== true) {
      errors.agree = "Veuillez accepter les conditions d'utilisation";
    }
    return errors;
  };

  // Gestion de la soumission du formulaire
  const handleSignUp = async (e) => {
    e.preventDefault();
    // on set le flag qui sera testé dans le useEffect
    setIsSubmit(true);
    // validation des données
    setFormErrors(validate(inputs));
  };

  // Tenter d'envoyer le formulaire si tout est correct
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      go();
    }
  }, [formErrors]);

  return (
    <main className={style.signup}>
      {/**** modal d'avertissement si remember  *******/}
      {displayModalOk && (
        <Modal
          display={
            <p>
              Votre demande de création de compte est bien prise en compte.{" "}
              <br />
              Vous allez recevoir un mail vous précisant le fonctionnement de
              notre application dès l'activation de votre accès. <br />
              Vous pourrez alors vous connecter.
              <br />A très vite 👋
            </p>
          }
          action={goOn}
        />
      )}
      {/********************************************/}
      <img src={logo} alt="Logo" />
      <h1>Creation de compte</h1>
      <p>
        {myError === 422 && (
          <p>Un conpte existe déja pour cette adresse mail</p>
        )}
        {myError === 500 ||
          (myError == 400 && (
            <p>Une erreur est survenue lors de la création de votre compte</p>
          ))}
      </p>
      <form onSubmit={handleSignUp}>
        <label htmlFor="email">email :</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleInputChange}
        />
        <p>{formErrors.email}</p>

        <label htmlFor="alias">username :</label>
        <input
          type="text"
          name="alias"
          autoComplete="username"
          id="alias"
          value={alias}
          onChange={handleInputChange}
        />
        <p>{formErrors.alias}</p>

        <label htmlFor="pwd">password :</label>
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
        <label htmlFor="confirmPwd"> confirm password :</label>
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
          <span className={style.space}> </span> j'accepte les condition
          générales d'utilisation
        </label>
        <p>{formErrors.agree}</p>
        <p className={style.infos_cgi}>
          J’ai pris connaissance et j’accepte les conditions générales
          d’utilisation et la politique de confidentialité de TradingHelper. En
          validant ce formulaire, vous consentez à ce que vos données
          personnelles soient traitées par TradingHelper, responsable du
          traitement, pour la création de votre compte et la gestion de votre
          inscription. Pour en savoir plus sur vos droits ainsi que nos
          traitements et pratiques en matière de données personnelles, prenez
          connaissance des mentions légales.
        </p>
        <BtnSubmit value="signUp" />
      </form>
      <p>
        <BtnLink link="/" title="Acceuil" />
      </p>
    </main>
  );
}

export default SignUp;
