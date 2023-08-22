import { NavLink } from "react-router-dom";
import img404 from "../../assets/img/404.jpg";
import styles from "./notFound.module.css";
import BtnLink from "../../Components/UI/BtnLink";

function NotFound() {
  return (
    <main className={styles.page404}>
      <h1>Vous semblez perdu...</h1>
      <img src={img404} alt="page 404" />
      <BtnLink link="/" title="Revenir vers l'acceuil" />
    </main>
  );
}

export default NotFound;
