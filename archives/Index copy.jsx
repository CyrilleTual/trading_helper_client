import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./sign.module.css";
import { useSignUserInMutation } from "../../store/slice/tradeApi";
import { signIn } from "../../store/slice/user";
import { useNavigate } from "react-router-dom";
import BtnSubmit from "../../Components/UI/BtnSubmit";
import BtnLink from "../../Components/UI/BtnLink";
import logo from "../../assets/img/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../Components/Modal/Index";
 

function SignIn() {
  const [inputs, setInputs] = useState({ email: "", pwd: "", remember: false });

  const [rememberMe, setRememberMe] = useState (false); 
  const [display, setDisplay] = useState(""); 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // après log et fonction passée au modal 
  const goOn  = () => {
    navigate("/global");
  };

  // verifie si est loggé et redirige vers tableau de bord si oui
  const islogged = useSelector((state) => state.user.isLogged);
  useEffect(() => {
    if (islogged) {
      goOn();
    }
    // eslint-disable-next-line
  }, []);



  // lors du chargement de la page on va voir si une cle remenber
  // existe dans le local storage si oui -> log automatique
  useEffect(() => {
    const rmemb = JSON.parse(localStorage.getItem("remember"));
    if (rmemb) {
      dispatch(
        signIn({
          id: rmemb.id,
          alias: rmemb.alias,
          email: rmemb.email,
          role: rmemb.role,
        })
      );

      // déclenche le modal -> information que l'on est loggé
      setRememberMe(true);
      setDisplay(rmemb.email);
      setInputs({ ...inputs, remember: !remember }); // pour cohérence

      // c'est la fermeture du modal qui déclanche la poursuite de la navigation
    }
  // eslint-disable-next-line
  }, []);

  // gestion du formulaire - bind des champs
  const { email, pwd, remember } = inputs;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleRememberChange = () => {
    setInputs({ ...inputs, remember: !remember });
  };

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  // middlware pour le set de la state via le store
  const [signUserIn] = useSignUserInMutation();

  // gestion des erreurs du formulaire
  const [myError, setMyError] = useState(null);

  // gestion de la visibilité du pwd
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(faEyeSlash);
  const handleToggle = () => {
    if (type === "password") {
      setIcon(faEye);
      setType("text");
    } else {
      setIcon(faEyeSlash);
      setType("password");
    }
  };

  // fonction de valisation du form retourne les erreurs
  const validate = (inputs) => {
    const errors = {};
    /* eslint-disable */
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!inputs.email) {
      errors.email = "Veuillez entrer votre email";
    } else if (!regex.test(inputs.email)) {
      errors.email = "Format email invalide";
    }
    if (!inputs.pwd) {
      errors.pwd = "Veuillez entrer votre mot de passe";
    }
    return errors;
    /* eslint-enable */
  };

  async function go() {
    signUserIn(inputs)
      .unwrap()
      .then(({ response }) => {
        localStorage.setItem("auth42titi@", response.TOKEN);
        if (remember) {
          localStorage.setItem(
            "remember",
            JSON.stringify({
              id: response.id,
              alias: response.alias,
              email: response.email,
              role: response.role,
              remember: true,
            })
          );
        }

        dispatch(
          signIn({
            id: response.id,
            alias: response.alias,
            email: response.email,
            role: response.role,
          })
        );
        navigate("/global");
      })
      .catch((error) => {
        setMyError(error.status);
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // on va checker les erreurs
    setFormErrors(validate(inputs));
    // on set le flag qui sera testé dans le useEffect
    setIsSubmit(true);
  };

  // on tente un envoi si tt est ok
  /* eslint-disable */
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      go();
    }
  }, [formErrors]);
  /* eslint-enable */



  return (
    <main className={styles.sign}>

      {/**** modal d'avertissement si remember  *******/}
      {rememberMe && display && (
        <Modal
          display={
            <p>
              Vous êtes connecté en tant que :<br />
              {display}
            </p>
          }
          action={goOn}
        />
      )}
      {/********************************************/}

      <img src={logo} alt="Logo" />
      <h1>Trading Helper</h1>
      {myError === 401 && <p className="blinck">Probleme d'identification</p>}

      {(!myError || myError === 401) && (
        <>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">email :</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              autoComplete="username"
              onChange={handleInputChange}
            />
            <p>{formErrors.email}</p>

            <label htmlFor="pwd">password :</label>
            <div className={styles.parentOfPwd}>
              <input
                type={type}
                name="pwd"
                autoComplete="current-password"
                id="pwd"
                value={pwd}
                onChange={handleInputChange}
              />
              <span className={styles.eye} onClick={handleToggle}>
                <FontAwesomeIcon icon={icon} />
              </span>
            </div>
            <p>{formErrors.pwd}</p>
            <label className={styles.labelCheck} htmlFor="remember">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                checked={remember}
                onChange={handleRememberChange}
              />
              <span className={styles.space}> </span> Rester identifié
            </label>
            <BtnSubmit value="LogIn" />
          </form>
          <p>
            Pas de compte ? En créer un
            <BtnLink link="/signUp" title="👉 ici 👈" />
          </p>
        </>
      )}

      {myError && myError !== 401 && (
        <div> Oups, un problème est survenu.... </div>
      )}
    </main>
  );
}

export default SignIn;
