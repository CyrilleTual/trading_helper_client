import { NavLink } from "react-router-dom";
import styles from "./credit.module.css";
import BtnLink from "../../Components/UI/BtnLink";

function Credits() {
  return (
    <main className={styles.credits}>
      <h1>Credits</h1>
      <div className={styles.wrapper}>
        <h2>Les images et illustrations proviennent de chez</h2>

        <p>
          <NavLink
            className={styles.links}
            to="https://fr.vecteezy.com/vecteur-libre/money"
            rel="noopener nofollow noreferrer"
            target="_blank"
          >
            Vecteezy.com
          </NavLink>{" "}
          et de chez <br />
          <NavLink
            className={styles.links}
            to="https://www.flaticon.com/free-icons/plus"
            rel="noopener nofollow noreferrer"
            target="_blank"
            title="plus icons"
          >
            Vectors Market - Flaticon
          </NavLink>
        </p>

        <h2>Le ticker-tape est fourni par</h2>

        <p>
          <NavLink
            className={styles.links}
            to="https://fr.tradingview.com/"
            rel="noopener nofollow noreferrer"
            target="_blank"
          >
            TradingView.com
          </NavLink>
        </p>
        <div className={styles.retour}></div>
        <BtnLink link="/" title="Acceuil" name="acceuil"/>
      </div>
    </main>
  );
}

export default Credits;
