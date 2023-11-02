import { useSelector } from "react-redux";
import { useGetGlobalDashBoardByUserQuery } from "../../../store/slice/tradeApi";
import { useEffect, useState } from "react";
import styles from "./Management.module.css";
import PerfMeter from "../../../Components/PerfMeter/Index";
import ProgressBar from "../../../Components/ProgressBar/Index";
import { validate } from "../validateInputs";
import PortfolioAfter from "./PortfolioAfter";

// prends en paramètre les valeurs du trade à venir
// recupère les données globales des différents portefeuilles et les données du portefeuille selectionné
// pour avertir des conséquences du trade sur le money management
// on a donc 5 sources de données  : values  lastInfos, portfolios /  global / portfolio

function Management({ values, lastInfos, portfolios }) {
  const last = +lastInfos.last;
  const currencySymbol = lastInfos.currency;

  const { inputErrors, verifiedValues } = validate(values);

  // Recupère l'id user depuis le store -> id
  const role = useSelector((state) => state.user.infos.role);
  let id = useSelector((state) => state.user.infos.id);
  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
  }
  // on va chercher la tableau de bord global pour un user (idUser)
  const { data: global, isError } = useGetGlobalDashBoardByUserQuery(id);

  // risk par position / valeur du portefeuille en % (totalBalance - pv latente )
  const [riskLigne, setRiskLigne] = useState(5);

  // caractères du trade
  const [tradeParams, setTradeParams] = useState(
    {
      maxSize: +0,
      neutral: +0,
      potentialWin: +0,
      potentialLost: +0,
      riskReward: +0,
      capitalInvested: +0,
      portfolioName: "",
    },
    [values]
  );

  // recup du portfolio selectionné et calculs
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    if (global && values && lastInfos && portfolios && portfolio) {
      setPortfolio(
        global.portfoliosArray.find(
          (element) => +element.id === +values.portfolioId
        )
      );
      const maxSize = +Math.floor(
        +(
          ((+portfolio.totalBalance - +portfolio.currentPv) * +riskLigne) /
          100
        ) / Math.abs(+values.price - +values.stop)
      );

      const neutral =
        values.position === "long"
          ? (+values.price * +values.quantity + +values.fees + +values.tax) /
            values.quantity
          : (+values.price * +values.quantity + -values.fees + -values.tax) /
            values.quantity;

      const initPv = (neutral - last) * +values.quantity;

      const capitalInvested =
        +values.price * +values.quantity + +values.fees + +values.tax;

      const potentialWin = (
        Math.abs(+values.target - +neutral) * +values.quantity
      ).toFixed(2);
      const potentialLost = (
        Math.abs(+values.stop - +neutral) * +values.quantity
      ).toFixed(2);

      const { title } = portfolios.find(
        (elet) => elet.id === +values.portfolioId
      );

      setTradeParams({
        ...tradeParams,
        maxSize: +maxSize,
        neutral: +neutral,
        capitalInvested: capitalInvested.toFixed(2),
        potentialWin: potentialWin,
        potentialLost: potentialLost,
        riskReward: (potentialWin / potentialLost).toFixed(2),
        portfolioName: title,
        portfolioCash: portfolio.cash,
      });
    }
  }, [global, values, portfolios, portfolio]);

  return (
    <>
      <div className={styles.metrics}>
        <h2>Métriques du trade :</h2>
        <p>
          Sur le portefeuille {tradeParams.portfolioName}, pour respecter un
          risque maximum de perte de {riskLigne} % de capital par ligne, vous
          pouvez entrer sur {tradeParams.maxSize} titres.
        </p>
        {inputErrors.length === 0 && (
          <>
            <p>
              Pour un trade de {values.quantity} titres soit un capital engagé
              de {tradeParams.capitalInvested} {currencySymbol}
              <br />
              Gain potentiel : {tradeParams.potentialWin} {currencySymbol} soit{" "}
              {(
                (tradeParams.potentialWin / tradeParams.capitalInvested) *
                100
              ).toFixed(2)}{" "}
              % du capital engagé
              <br />
              Perte potentielle : {tradeParams.potentialLost} {currencySymbol}{" "}
              soit{" "}
              {(
                (tradeParams.potentialLost / tradeParams.capitalInvested) *
                100
              ).toFixed(2)}{" "}
              % du capital engagé et{" "}
              {(
                (tradeParams.potentialLost /
                  (+portfolio.totalBalance - +portfolio.currentPv)) *
                100
              ).toFixed(2)}{" "}
              % du portefeuille
              <br />
              Risk-Reward : {tradeParams.riskReward}
            </p>

            <ProgressBar
              stop={+values.stop}
              target={+values.target}
              now={last.toFixed(2)}
              symbol={currencySymbol}
              targetAtPc={(
                (tradeParams.potentialWin / tradeParams.capitalInvested) *
                100
              ).toFixed(2)}
              riskAtPc={(
                (tradeParams.potentialLost / tradeParams.capitalInvested) *
                100
              ).toFixed(2)}
              meterInvalid={false}
              neutral={+tradeParams.neutral}
              position={values.position}
              status={"onGoing"}
            />
          </>
        )}
      </div>

      {inputErrors.length === 0 && (
        <div className={styles.portfolio}>

          <h2>Consequences sur le portefeuille</h2>

          <div className={styles.meter_container}>
            <PerfMeter
              legend={`Simulation - ${tradeParams.portfolioName}`}
              min={(
                portfolio.perfIfStopeed - tradeParams.potentialLost
              ).toFixed(0)}
              max={(
                portfolio.potential +
                portfolio.currentPv +
                +tradeParams.potentialWin
              ).toFixed(0)}
              perf={portfolio.currentPv}
              meterWidth={styles.meterWidth}
              meterHeight={styles.meterHeight}
            />
          </div>

          <PortfolioAfter
            portfolio={portfolio}
            currencySymbol={currencySymbol}
            tradeParams={tradeParams}
            values={values}
          />
          
        </div>
      )}
    </>
  );
}

export default Management;
