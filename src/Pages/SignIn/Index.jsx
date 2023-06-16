import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import style from "./index.module.css";
import { useSignUserInMutation } from "../../store/slice/tradeApi";
import { signIn } from "../../store/slice/user";

function SignIn() {
  const [inputs, setInputs] = useState({ email: "", pwd: "" });

  // gestion du formulaire 
  const { email, pwd } = inputs;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };


  // middlware pour le set de la state via le store
  const [signUserIn, response] = useSignUserInMutation();
  const dispatch = useDispatch();

  // affichage du nom recuperé dans le store  
  const { alias } = useSelector((state) => ({
    ...state.user.infos,
  }));
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signUserIn(inputs); // envoyer des inputs "sains/nettoyés"
      localStorage.setItem("auth", res.data.TOKEN);
      //localStorage.setItem("infos", JSON.stringify({alias:res.data.alias, email:res.data.email, role:res.data.role}));
      dispatch(
        signIn({
          alias: res.data.alias,
          email: res.data.email,
          role: res.data.role,
        })
      );
      // navigate("/");
    } catch (err) {
      console.log(err);
      //setMsg("problème d'identifiant");
    }
  };

  return (
    <main className={style.main}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">email :</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleInputChange}
        />

        <label htmlFor="pwd">password :</label>
        <input
          type="pwd"
          name="pwd"
          id="pwd"
          value={pwd}
          onChange={handleInputChange}
        />
        <input type="submit" value="LogIn" />
      </form>

      <p>
        Pas de compte ? En créer un <Link to={"/"}>👉 ici 👈</Link>
      </p>

      {response.isSuccess && <p>Bonjour {alias}</p>}
    </main>
  );
}

export default SignIn;
