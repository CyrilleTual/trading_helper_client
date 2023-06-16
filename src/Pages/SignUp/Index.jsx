import { useState } from "react";
import style from "./index.module.css";
import { useSignUserUpMutation } from "../../store/slice/tradeApi";
 

function SignUp() {

  // middlware pour le set de la state via le store
  const [signUserUp] = useSignUserUpMutation();

  const [inputs, setInputs] = useState({
    email: "",
    alias: "",
    pwd: "",
    confirmPwd: "",
    agree: false,
  });

  // gestion du formulaire
  const { email, alias, pwd, confirmPwd, agree } = inputs;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };
  const handleAgreeChange = () => {
    setInputs({ ...inputs, agree: !agree });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
   
    ///////////  attention les données brutes du formulaires sont à traiter pour envoyer
    /// un json - verifier email - conformité des mots de passe et identiques + agree
    const datas = {
      email: inputs.email,
      pwd: inputs.pwd,
      alias: inputs.alias,
    };

    // on envoie data au back

    
     try {
        console.log(inputs);
      const res = await signUserUp(datas); 
      console.log(res) 
       // navigate("/");
     } catch (err) {
       console.log(err);
       //setMsg("problème d'identifiant");
     }

    //    const res = await signup(inputs);
    //    if (res.status === 201) {
    //      setInputs({ email: "", password: "" });
    //      navigate("/entry", { state: { type: "se connecter" } });
    //    }
    // else envoyer un message d'erreur (gérer coté back la réponse : erreur serveur, email déjà existant ..)
  };

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

        <label htmlFor="alias">username :</label>
        <input
          type="alias"
          name="alias"
          id="alias"
          value={alias}
          onChange={handleInputChange}
        />

        <label htmlFor="pwd">password :</label>
        <input
          type="password"
          name="pwd"
          id="pwd"
          value={pwd}
          onChange={handleInputChange}
        />
        <label htmlFor="confirmPwd"> confirm password :</label>
        <input
          type="password"
          name="confirmPwd"
          id="confirmPwd"
          value={confirmPwd}
          onChange={handleInputChange}
        />
        <label htmlFor="agree">I agree to Terms of Service </label>
        <input
          type="checkbox"
          name="agree"
          id="agree"
          checked={agree}
          onChange={handleAgreeChange}
        />
        <input type="submit" value="signUp" />
      </form>
    </main>
  );
}

export default SignUp;
