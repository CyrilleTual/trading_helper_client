import { useParams, NavLink } from "react-router-dom";
import styles from "./detailPorfolio.module.css";
import { useGetDetailPortfolioByIdQuery } from "../../store/slice/tradeApi";
import { useEffect, useState } from "react";
import { resetStorage } from "../../utils/tools";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../store/slice/user";
import { Loading } from "../../Components/Loading/Index";
import { ReactComponent as Minus } from "../../assets/img/minus.svg";
import { ReactComponent as Plus } from "../../assets/img/plus.svg";
import { ReactComponent as Adjust } from "../../assets/img/adjust.svg";
import Modal from "../../Components/Modal/Index";

function DetailPorfolio() {
  // on chek si visiteur pour adapter l'affichage
  let isVisitor = true;
  if (
    useSelector((state) => state.user.infos.role).substring(0, 7) !== "visitor"
  ) {
    isVisitor = false;
  }

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

  // alerte si stop touché ou objectif atteint /////////////////////////////////////////
  const [valuesStopped, setValuesStopped] = useState([]);
  const [valuesOnObjective, setValuesOnObjective] = useState([]);

  useEffect(() => {
    if (data) {
      setValuesOnObjective([
        ...valuesOnObjective,
        ...data.filter(
          (element) =>
            element.position === "long" && +element.last > +element.target
        ),
        ...data.filter(
          (element) =>
            element.position === "short" && +element.last < +element.target
        ),
      ]);

      setValuesStopped([
        ...valuesStopped,
        ...data.filter(
          (element) =>
            element.position === "long" && +element.last < +element.stop
        ),
        ...data.filter(
          (element) =>
            element.position === "short" && +element.last > +element.stop
        ),
      ]);
    }
    // eslint-disable-next-line
  }, [data, isLoading]);

  const afterModal = () => {
    setValuesStopped([]);
    setValuesOnObjective([]);
  };

  // préparation du tableau des valeurs ////////////////////////////////////////////

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
        <Loading />
      ) : (
        !isError && (
          <main className={styles.detail}>
            <h1>Trades actifs</h1>
            <div className={styles.arraysContainer}>
              {(valuesOnObjective.length > 0 || valuesStopped.length > 0) && (
                <Modal
                  display={
                    <>
                      <h2>Alerte :</h2>
                      {valuesOnObjective.length > 0 && (
                        <>
                          {valuesOnObjective.map((elt, io) => (
                            <p key={io}>{elt.title} est sur objectif.</p>
                          ))}
                        </>
                      )}
                      {valuesStopped.length > 0 && (
                        <>
                          {valuesStopped.map((elt, is) => (
                            <p key={is}>{elt.title} a touché son stop.</p>
                          ))}
                        </>
                      )}
                    </>
                  }
                  action={afterModal}
                />
              )}

              <div className={styles.leftArray}>
                {" "}
                <table>
                  <tbody>
                    {myLabels.map((element, i) => (
                      <tr key={i}>
                        <td>{element}</td>
                      </tr>
                    ))}
                    {!isVisitor && (
                      <>
                        <tr>
                          <td>Renforcer ?</td>
                        </tr>
                        <tr>
                          <td>Alléger ?</td>
                        </tr>
                        <tr>
                          <td>Ajuster ?</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <div className={styles.rightArray}>
                <table>
                  <tbody>
                    {newArrayValues.map((element, i) => (
                      <tr key={i}>
                        {element.map((elt, j) => (
                          <td key={j} datatofocus={elt}>
                            {elt}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {!isVisitor && (
                      <>
                        <tr>
                          {data.map((elt, j) => (
                            <td key={j}>
                              <NavLink
                                className={` ${styles.action}`}
                                to={`/reEnter/portfolio/${portfolioId}/stock/${elt.tradeId}`}
                              >
                                <Plus className={styles.plus} />
                              </NavLink>
                            </td>
                          ))}
                        </tr>

                        <tr>
                          {data.map((elt, k) => (
                            <td key={k}>
                              <NavLink
                                className={`${styles.moins} ${styles.action}`}
                                to={`/portfolio/${portfolioId}/exitTrade/${elt.tradeId}`}
                              >
                                <Minus className={styles.moins} />
                              </NavLink>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          {data.map((elt, k) => (
                            <td key={k}>
                              <NavLink
                                className={`${styles.action}`}
                                to={`/portfolio/${portfolioId}/ajust/${elt.tradeId}`}
                              >
                                <Adjust className={styles.ajust}></Adjust>
                              </NavLink>
                            </td>
                          ))}
                        </tr>
                      </>
                    )}
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
