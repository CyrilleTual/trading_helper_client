import { useParams, NavLink } from "react-router-dom";
import styles from "./detailPorfolio.module.css";
import { useGetDetailPortfolioByIdQuery } from "../../store/slice/tradeApi";
import { useEffect } from "react";
import { resetStorage } from "../../utils/tools";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../store/slice/user";

function DetailPorfolio() {
  const { portfolioId } = useParams();

  const { data, isLoading, isError } =
    useGetDetailPortfolioByIdQuery(portfolioId);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      resetStorage();
      // on reset le state
      dispatch(signOut());
      navigate("/");
    }
  // eslint-disable-next-line
  }, [isError]);

  let myLabels = [
    "trade N°",
    "support",
    "dernier",
    "type de position",
    "pru",
    "-/+ value ",
    "-/+ value %",
    "potentiel  ",
    "potentiel %",
    "si stop touché",
    "si stop toiuché %",
    "variation jour",
    "variation jour %",
    "objectif",
    "stop",
    "valeur initilale",
    "valeur actuelle",
    "nombre de titres",
  ];

  let newArrayValues = [];
  if (!isLoading && !isError) {
    // on prépare pour affichage de droite à gauche
    // pour chaque share
    let arrayValues = [];

    for (const element of data) {
      const values = Object.values(element);

      let newValues = [];

      for (let index = 0; index < values.length; index++) {
        if (
          typeof values[index] === "number" &&
          index !== 0 &&
          index !== values.length - 1
        ) {
          values[index] = values[index].toFixed(2);
        }
        newValues.push(values[index]);
      }

      //  values.forEach(function(item){
      //   if( typeof (item)=== "number"){
      //     item = item.toFixed(2)
      //   }
      //   newValues.push(item)
      //  })

      // on push les values dans un tableau
      arrayValues.push(newValues);
    }
    // flit du tableau
    newArrayValues = Object.keys(arrayValues[0]).map(function (c) {
      return arrayValues.map(function (r) {
        return r[c];
      });
    });
  }
  return (
    <>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        !isError && (
          <main className={styles.detail}>
            <h1>Trades actifs</h1>
            <div className={styles.arraysContainer}>
              <div className={styles.leftArray}>
                {" "}
                <table>
                  <tbody>
                    {myLabels.map((element, i) => (
                      <tr key={i}>
                        <td>{element}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>Renforcer ?</td>
                    </tr>
                    <tr>
                      <td>Alléger ?</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.rightArray}>
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
                      {data.map((elt, j) => (
                        <td key={j}>
                          <NavLink
                            className={styles.button}
                            to={`/reEnter/portfolio/${portfolioId}/stock/${elt.tradeId}`}
                          >
                            Re-Enter
                          </NavLink>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      {data.map((elt, k) => (
                        <td key={k}>
                          <NavLink
                            className={styles.button}
                            to={`/portfolio/${portfolioId}/exitTrade/${elt.tradeId}`}
                          >
                            Exit
                          </NavLink>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )
      )}
    </>
  );
}

export default DetailPorfolio;
