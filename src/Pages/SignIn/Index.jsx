import { useState } from "react";
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

  // gestion du formulaire 
  const { email, pwd } = inputs;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };


  // middlware pour le set de la state via le store
  const [signUserIn] = useSignUserInMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signUserIn(inputs); // envoyer des inputs "sains/nettoyés"
      localStorage.setItem("auth", res.data.TOKEN);
      //localStorage.setItem("infos", JSON.stringify({alias:res.data.alias, email:res.data.email, role:res.data.role}));
      dispatch(
        signIn({
          id: res.data.id,
          alias: res.data.alias,
          email: res.data.email,
          role: res.data.role,
        })
      );
      navigate("/global");
    } catch (err) {
      console.log(err);
      //setMsg("problème d'identifiant");
    }
  };

  return (
    <main className={styles.signin}>
      <img src={logo} alt="Logo" />
      <h1>Trading Helper</h1>
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

        <label htmlFor="pwd">password :</label>
        <input
          type="pwd"
          name="pwd"
          autoComplete="current-password"
          id="pwd"
          value={pwd}
          onChange={handleInputChange}
        />
        <BtnSubmit value="LogIn" />
      </form>

      <p>
        Pas de compte ? En créer un
        <BtnLink link="/signUp" title="👉 ici 👈" />
      </p>
    </main>
  );
}

export default SignIn;
