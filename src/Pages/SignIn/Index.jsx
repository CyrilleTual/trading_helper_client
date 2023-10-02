import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  useLogByRememberQuery,
  useSignUserInMutation,
  useGetGlobalDashBoardByUserQuery,
} from "../../store/slice/tradeApi";
import { signIn } from "../../store/slice/user";

import BtnSubmit from "../../Components/UI/BtnSubmit";
import BtnLink from "../../Components/UI/BtnLink";
import logo from "../../assets/img/logo.jpg";
import Modal from "../../Components/Modal/Index";
import styles from "./sign.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
 
 
// Composant de connexion d'un utilisateur déja enregistré
function SignIn() {
  // State pour gérer les champs du formulaire
  const [inputs, setInputs] = useState({ email: "", pwd: "", remember: false });
  // State pour gérer le remember me
  const [rememberMe, setRememberMe] = useState(false);
  // State pour gérer l'affichage du message de connexion réussie
  const [display, setDisplay] = useState("");

  // hooks de navigation
  const navigate = useNavigate();

  // hoook d'acces au store redux
  const dispatch = useDispatch();

  // après log et fonction passée au modal
  const goOn = () => {
    navigate("/global");
  };

  // Redirection si l'utilisateur est déjà connecté
  const islogged = useSelector((state) => state.user.isLogged);
  useEffect(() => {
    if (islogged) {
      goOn();
    }
    // eslint-disable-next-line
  }, []);

  // Utilisation du hook pour vérifier la validité du token et obtenir les infos utilisateur
  const [skip, setSkip] = useState(true); // attend que l'on ai bien un remember pour action
  const { data, isError } = useLogByRememberQuery(null, { skip });

  // pour aller chercher les infos du globalportfolio
  const [skip2, setSkip2] = useState(true);
  const [idToWorkOn, setIdToWorkOn] = useState(null);
 function useFetchGlobalDashboard(idToWorkOn, skip) {
   const { data: globalData } = useGetGlobalDashBoardByUserQuery(idToWorkOn, {
     skip,
   });
   return globalData;
 }

  // Vérification de l'existence de la clé "remember" dans le local storage pour une connexion automatique
  useEffect(() => {
    const rmemb = JSON.parse(localStorage.getItem("remember"));
    if (rmemb) {
      setSkip(false);
    }
    // eslint-disable-next-line
  }, []);

  // log automatique suite au rementber 
  useEffect(() => {
    if (data && !isError) {
      dispatch(
        signIn({
          id: data.response.id,
          alias: data.response.alias,
          email: data.response.email,
          role:data.response.role,
        })
      );
      // //lance la requete pour aller cherhcer les infos de global
       if (data.response.role.substring(0, 7) === "visitor") {
        setIdToWorkOn ((data.response.role).substring(8));
      }else{
        setIdToWorkOn(data.response.id);
      }
      // déclenche le modal -> information que l'on est loggé
      setRememberMe(true);
      setDisplay(data.response.email);
      setInputs({ ...inputs, remember: !remember }); // pour cohérence
    }
    if (isError) {
     navigate("/");
    }
    //c'est la fermeture du modal qui déclanche la poursuite de la navigatio
    // eslint-disable-next-line
  }, [data, isError]);

  // une fois que l'on a l'idtoworkon on déclanche le prefetch
  useEffect (()=>{
    {
       if (idToWorkOn !== null)setSkip2(false);
    }
 } ,[idToWorkOn])

 useFetchGlobalDashboard(idToWorkOn, skip2);

  //////////////////////////////////////////////////////////////////////////////////
  // gestion du formulaire - bind des champs
  const { email, pwd, remember } = inputs;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  // Gestion du champ "Se souvenir de moi"
  const handleRememberChange = () => {
    setInputs({ ...inputs, remember: !remember });
  };

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  // Mutation pour la connexion utilisateur (set via le store)
  const [signUserIn] = useSignUserInMutation();

  // gestion des erreurs du formulaire
  const [myError, setMyError] = useState(null);

  // Gestion de la visibilité du mot de passe /////////////////////
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
    //const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const regex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!inputs.email) {
      errors.email = "Veuillez entrer votre email";
    } else if (!regex.test(inputs.email)) {
      errors.email = "Identification impossible";
    }
    if (!inputs.pwd) {
      errors.pwd = "Veuillez entrer votre mot de passe";
    } else if (inputs.pwd.length < 4 || inputs.pwd.length > 30) {
      errors.pwd = "Identification impossible";
    }
    return errors;
    /* eslint-enable */
  };

  // Fonction appelée après soumission du formulaire en l'absence d'erreur
  async function go() {
    signUserIn(inputs) // Appel de la mutation pour la connexion de l'utilisateur
      .unwrap()
      .then(({ response }) => {
        localStorage.setItem("auth42titi@", response.TOKEN);
        if (remember) {
          localStorage.setItem(
            "remember",
            JSON.stringify({
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
      {(myError === 401 || myError === 400) && (
        <p className="blinck">Probleme d'identification</p>
      )}

      {(!myError || myError === 401 || myError === 400) && (
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
            <BtnSubmit value="LogIn" name="login" />
          </form>
          <p>
            Pas de compte ? En créer un{" "}
            <BtnLink link="/signUp" title="👉 ici 👈" name="créer compte" />
          </p>
        </>
      )}
    </main>
  );
}

export default SignIn;
