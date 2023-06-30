import { useState, useEffect } from "react";
import style from "./index.module.css";
import { useSignUserUpMutation } from "../../store/slice/tradeApi";

function SignUp() {
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

  // gestion du formulaire
  const { email, alias, pwd, confirmPwd, agree } = inputs;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };
  const handleAgreeChange = () => {
    setInputs({ ...inputs, agree: !agree });
  };

  /// fonction d'envoie

  async function go(){

    const datas = {
    email: inputs.email,
    pwd: inputs.pwd,
    alias: inputs.alias,
    }
  
    signUserUp(datas)
    .unwrap()
    .then((res) => console.log(result)) /// user bien créé
    .catch((error)=>{
    console.log(error)
    })


    //    const res = await signup(inputs);
    //    if (res.status === 201) {
    //      setInputs({ email: "", password: "" });
    //      navigate("/entry", { state: { type: "se connecter" } });
    //    }
    // else envoyer un message d'erreur (gérer coté back la réponse : erreur serveur, email déjà existant ..)
    //}


  }


 






  // fonction de valisation du form retourne les erreurs
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    // validation des données
    setFormErrors(validate(inputs));
    // on set le flag qui sera testé dans le useEffect
    setIsSubmit(true);
  };

  // on tente un envoie si tt est ok
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      go();
    }
  }, [formErrors]);

  return (
    <main className={style.main}>
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
          type="alias"
          name="alias"
          id="alias"
          value={alias}
          onChange={handleInputChange}
        />
        <p>{formErrors.alias}</p>

        <label htmlFor="pwd">password :</label>
        <input
          type="password"
          name="pwd"
          id="pwd"
          value={pwd}
          onChange={handleInputChange}
        />
        <p>{formErrors.pwd}</p>

        <label htmlFor="confirmPwd"> confirm password :</label>
        <input
          type="password"
          name="confirmPwd"
          id="confirmPwd"
          value={confirmPwd}
          onChange={handleInputChange}
        />
        <p>{formErrors.confirmPwd}</p>

        <label htmlFor="agree">I agree to Terms of Service </label>
        <input
          type="checkbox"
          name="agree"
          id="agree"
          checked={agree}
          onChange={handleAgreeChange}
        />
        <p>{formErrors.agree}</p>

        <input type="submit" value="signUp" />
      </form>
    </main>
  );
}

export default SignUp;
