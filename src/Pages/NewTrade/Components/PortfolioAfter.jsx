import styles from "./portfolioAfter.module.css"

function PortfolioAfter({portfolio, currencySymbol, tradeParams, values}) { 

    console.log(portfolio, currencySymbol, tradeParams, values);



  return (
    <div>
      <p>
        Situation actuelle : {portfolio.currentPv > 0 ? `gain ` : `perte`} de{" "}
        {portfolio.currentPv}
      </p>{" "}
      <table className={styles.portTable}>
        <tbody>
          <tr>
            <td className={styles.col1}>+/- value latente :</td>
            <td className={styles.col2}>
              {portfolio.currentPv} {currencySymbol}
            </td>
            <td className={styles.col3}>{portfolio.currentPvPc}%</td>
          </tr>
          <tr>
            <td>Potentiel :</td>
            <td>
              {portfolio.potential} {currencySymbol}
            </td>
            <td>{portfolio.potentialPc}%</td>
          </tr>
          <tr>
            <td>Perf si stops touchés :</td>
            <td>
              {portfolio.perfIfStopeed} {currencySymbol}
            </td>
            <td>{portfolio.perfIfStopeedPc}%</td>
          </tr>
          <tr>
            <td>cash total versé :</td>

            <td>
              {portfolio.initCredit} {currencySymbol}
            </td>
            <td></td>
          </tr>
          <tr>
            <td>Exposition :</td>

            <td>
              {portfolio.assets} {currencySymbol}
            </td>
            <td></td>
          </tr>
          <tr>
            <td>Liquidités :</td>

            <td>
              {portfolio.cash} {currencySymbol}
            </td>
            <td></td>
          </tr>
          <tr>
            <td>Valorisation totale :</td>

            <td>
              {portfolio.totalBalance} {currencySymbol}
            </td>
            <td></td>
          </tr>
          <tr>
            <td>Performance totale :</td>
            <td>
              {portfolio.totalPerf} {currencySymbol}
            </td>
            <td>{portfolio.totalPerfPc} %</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PortfolioAfter