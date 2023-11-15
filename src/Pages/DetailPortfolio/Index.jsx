import { useParams, NavLink } from "react-router-dom";
import styles from "./detailPorfolio.module.css";
import {
  useGetTradesActivesByUserQuery,
} from "../../store/slice/tradeApi";
import { useEffect, useState } from "react";
import { resetStorage } from "../../utils/tools";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../store/slice/user";
import { Loading } from "../../Components/Loading/Index";
import { ReactComponent as Minus } from "../../assets/img/minus.svg";
import { ReactComponent as Plus } from "../../assets/img/plus.svg";
import { ReactComponent as Adjust } from "../../assets/img/adjust.svg";
import { ReactComponent as Details } from "../../assets/img/details.svg";
import { ReactComponent as Trash } from "../../assets/img/trash.svg";
import Modal from "../../Components/Modal/Index";
import { calculMetrics } from "../../utils/calculateTradeMetrics";
import DeleteTrade from "../../Components/DeleteTrade/Index";

/**
 *
 */
function DetailPorfolio() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // on chek si visiteur pour adapter l'affichage //////////////////////////////////////
  const role = useSelector((state) => state.user.infos.role);
  let id = useSelector((state) => state.user.infos.id);
  let isVisitor = false;
  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
    isVisitor = true;
  }
  //  recupère l'id du portefeuille qui nous importe
  const { portfolioId } = useParams();

  // détail des trades par le hook GetTradesActivesByUserQuery filtré
  const {
    data: originalsTrades,
    isLoading,
    isSuccess: tradesisSuccess,
    isError ,
  } = useGetTradesActivesByUserQuery(id);

 


  const [tradesFiltered, setTradesFiltered] = useState([]);
  useEffect(() => {
    if (tradesisSuccess) {
      setTradesFiltered(
        originalsTrades.filter((trade) => +trade.portfolioId === +portfolioId)
      );
    }
    // eslint-disable-next-line
  }, [originalsTrades]);

  ///// recupère un tableau des trades complétés //////////
  const [tradesFull, setTradesFull] = useState([]);
  useEffect(() => {
    let completedTrade = [];
    for (const trade of tradesFiltered) {
      const { tradeFull } = calculMetrics(trade);
      completedTrade.push(tradeFull);
    }
    setTradesFull(completedTrade);
  }, [tradesFiltered]);



  ///////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////  on reconstitue  le  même squelette que la première methode //////

  const [data, setData] = useState([]);

  useEffect(() => {
    let newTrades = [];

    for (const trade of tradesFull) {
      let newTrade = {
        tradeId: trade.tradeId,
        uid: (trade.uidForUser).toFixed(0),
        title: trade.title,
        last: trade.lastQuote,
        position: trade.position,
        pru: trade.pru,
        currentPv: +trade.balance,
        currentPvPc: +trade.balancePc,
        potential: (trade.target - trade.tradeQuote) * trade.actualQuantity,
        potentialPc:
          ((trade.target - trade.tradeQuote) / trade.tradeQuote) * 100,
        perfIfStopeed: +trade.risk,
        perfIfStopeedPc: +trade.riskPc,
        dailyVariation:
          (trade.tradeQuote - trade.beforeQuote) * trade.actualQuantity,
        dailyVariationPc:
          ((trade.tradeQuote - trade.beforeQuote) / trade.beforeQuote) * 100,
          target: trade.target,
        stop: trade.stop,
        initialValue: trade.pru * trade.actualQuantity,
        actualValue: +trade.actualQuantity * trade.tradeQuote,
        nbActivesShares: +trade.actualQuantity,
      };

      newTrades.push(newTrade);
    }
 

    setData([...newTrades]);
  }, [tradesFull]);

 
 

  /////////////////////////////////////////////////////////////////////////////
  ///    traitement des erreurs de chargement
  useEffect(() => {
    if (isError) {
      resetStorage();
      // on reset le state
      dispatch(signOut());
      navigate("/");
    }
    // eslint-disable-next-line
  }, [isError]);
  /////////////////////////////////////////////////////////////////////////////

  let myLabels = [
    "trade N°",
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

  // construction du tableau des numero de trade
  const [listOfTrades, setListOfTrades] = useState([]);

  const [valuesStopped, setValuesStopped] = useState([]);
  const [valuesOnObjective, setValuesOnObjective] = useState([]);
  useEffect(() => {
    if (data) {
      const arrayTrades = [];
      for (const elt of data) {
        arrayTrades.push(elt.tradeId);
      }
      setListOfTrades([...arrayTrades]);
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
  /////////////////////////////////////////////////////////////////////////////////////

  const afterModal = () => {
    setValuesStopped([]);
    setValuesOnObjective([]);
  };

  // préparation du tableau des valeurs ////////////////////////////////////////////
  let newArrayValues = [];

  if (!isLoading && !isError && data.length > 0) {
    // on prépare pour affichage de droite à gauche
    // pour chaque share
    let arrayValues = [];
    for (const element of data) {
      const values = Object.values(element); // recupère les valeurs (sans les cléfs)
      let newValues = [];
      // parcours le tableau des valeurs pour préparer les valeurs numériques -> tofixed(2)
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


  //// delete trade 

  const [displayModalAlert, setDisplayModalAlert] = useState (false)
  const [tradeToDelete, setTradeToDelete] = useState ()

  const afterModal2 = () => {
    setDisplayModalAlert(false);
  };

  function deleteTrade(trade) {
    setDisplayModalAlert(true);
    setTradeToDelete(trade);
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
              {/********************** Modal d'alerte si tp ou stop atteint **************************/}
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

              {/********************** Modal d'alerte demande de suppression **************************/}

              {displayModalAlert && (
                <Modal
                  display={
                    <DeleteTrade
                      trade={tradeToDelete}
                      abort={afterModal2}
                    />
                  }
                  action={afterModal2}
                />
              )}

              {/***************************************************************************************/}
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
                      <td>Détail ?</td>
                    </tr>
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
                        <tr>
                          <td>Effacer ?</td>
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
                    <tr>
                      {data.map((elt, j) => (
                        <td key={j}>
                          <NavLink
                            className={` ${styles.action}`}
                            to={`/portfolio/${portfolioId}/detail/${elt.tradeId}`}
                          >
                            <Details className={styles.details} />
                          </NavLink>
                        </td>
                      ))}
                    </tr>

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
                                to={{
                                  pathname: `/portfolio/${portfolioId}/ajust/${elt.tradeId}`,
                                }}
                                state={{
                                  portfolioId: portfolioId,
                                  tradesIdArray: listOfTrades,
                                }}
                              >
                                <Adjust className={styles.ajust}></Adjust>
                              </NavLink>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          {data.map((elt, k) => (
                            <td key={k}>
                              <div
                                className={`${styles.action}`}
                                onClick={() => deleteTrade(elt)}
                              >
                                <Trash className={styles.trash}></Trash>
                              </div>
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
