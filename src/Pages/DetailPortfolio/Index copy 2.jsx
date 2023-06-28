import { useParams, NavLink } from "react-router-dom";
import styles from "./detailPorfolio.module.css";
import { useGetDetailPortfolioByIdQuery } from "../../store/slice/tradeApi";

function DetailPorfolio() {
  const { portfolioId } = useParams();

  const { data, isLoading } = useGetDetailPortfolioByIdQuery(portfolioId);

  let newArrayValues = [];
  if (!isLoading) {
    // on prépare pour affichage de droite à gauche
    // pour chaque share
    let arrayValues = [];
    let arrayKeys = [];
    for (const element of data) {
      // on recupère les clés
      arrayKeys = Object.keys(element);
      const values = Object.values(element);
      // on push les values dans un tableau
      arrayValues.push(values);
    }

    // on unshift le tableau des clé -> intitules de lignes
    // a remplacer par des intitulés compréhensibles

    arrayValues.unshift(arrayKeys);
    // flit du tableau
    newArrayValues = Object.keys(arrayValues[0]).map(function (c) {
      return arrayValues.map(function (r) {
        return r[c];
      });
    });

    console.log (data)
  }
  return (
    <>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <main className={styles.detail}>
          <p>Bonjour ! </p>
          <table>
            <tbody>
              {newArrayValues.map((element, i) => (
                <tr key={i}>
                  {element.map((elt, j) => (
                    <td key={j}>{elt}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td>Buy more</td>
                {data.map((elt, j) => (
                  <td key={j}>
                    <NavLink
                      className={styles.button}
                      to={`/reEnter/${elt.tradeId}`}
                    >
                      Re-Enter
                    </NavLink>
                  </td>
                ))}
              </tr>
              <tr>
                <td>Sell</td>
                {data.map((elt, k) => (
                  <td key={k}>
                    <NavLink
                      className={styles.button}
                      to={`/exitTrade/${elt.tradeId}`}
                    >
                      Exit
                    </NavLink>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </main>
      )}
    </>
  );
}

export default DetailPorfolio;
