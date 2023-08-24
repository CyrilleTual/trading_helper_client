import broken from "../../assets/img/broken_pencil.jpg";
import styles from "./errorServer.module.css";
import BtnLink from "../../Components/UI/BtnLink";


function ErrorServer() {
  return (
    <main className={styles.errorServer}>
      <h1>L'application rencontre un problème ...</h1>
      <img src={broken} alt="broken pencil" />
      <BtnLink link="/" title="Acceuil" />
    </main>
  );
}

export default ErrorServer


 
 
