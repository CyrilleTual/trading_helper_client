import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./index.module.css";
import { useSignUserInMutation } from "../../store/slice/tradeApi";
import { signIn } from "../../store/slice/user";
import { useNavigate } from "react-router-dom";
import BtnSubmit from "../../Components/UI/BtnSubmit";
import BtnLink from "../../Components/UI/BtnLink";
import logo from "../../assets/img/logo.jpg";



function SignIn() {
  const [inputs, setInputs] = useState({ email: "", pwd: "" });

  // gestion du formulaire - bind des champs
  const { email, pwd } = inputs;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  // middlware pour le set de la state via le store
  const [signUserIn] = useSignUserInMutation();
  const [myError, setMyError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // fonction de valisation du form retourne les erreurs
  const validate = (inputs) => {
    const errors = {};
    /* eslint-disable */
    const regex =
     /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
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

  // on tente un envoie si tt est ok
  /* eslint-disable */
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      go();
    }
  }, [formErrors]);
  /* eslint-enable */

  return (
    <main className={styles.signin}>
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
            <input
              type="password"
              name="pwd"
              autoComplete="current-password"
              id="pwd"
              value={pwd}
              onChange={handleInputChange}
            />
            <p>{formErrors.pwd}</p>
            <BtnSubmit value="LogIn" />
          </form>
          <p>
            Pas de compte ? En créer un
            <BtnLink link="/signUp" title="👉 ici 👈" />
          </p>
        </>
      )}

      {myError !== 401 && <div>Oups, un problème est survenu.... </div>}
    </main>
  );
}

export default SignIn;
