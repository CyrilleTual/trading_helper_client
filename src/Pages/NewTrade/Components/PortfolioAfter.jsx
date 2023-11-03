import styles from "./portfolioAfter.module.css";

function PortfolioAfter({ portfolio, tradeParams, values, lastInfos }) {
  const currencySymbol = lastInfos.currency;

  // console.log(portfolio, currencySymbol, tradeParams, values, lastInfos);
  // plus value sur la nouvelle ligne
  const newPv =
    portfolio.currentPv -
    tradeParams.capitalInvested +
    values.quantity * lastInfos.last;

  const newCapitalengaged = portfolio.activeK + +tradeParams.capitalInvested;

  const newTotalBalance =
    +portfolio.assets +
    values.quantity * lastInfos.last +
    (portfolio.cash - +tradeParams.capitalInvested);

  const newPerfAtTp =
    portfolio.potential + portfolio.currentPv + +tradeParams.potentialWin;
  const newPerfAtStop = portfolio.perfIfStopeed - +tradeParams.potentialLost;

  return (
    <div>
      <table className={styles.portTable}>
        <tbody>
          <tr>
            <td className={styles.col1}>+/- value latente :</td>

            <td className={styles.col2}>
              {newPv.toFixed(0)} {currencySymbol}
            </td>
            <td>
              {" "}
              <span className={styles.minus}>
                {" "}
                ({portfolio.currentPv.toFixed(0)}){" "}
              </span>
            </td>
            <td className={styles.col3}>
              {((newPv / newCapitalengaged) * 100).toFixed(2)}%
            </td>
            <td>
              <span className={styles.minus}>({portfolio.currentPvPc})</span>
            </td>
          </tr>
          <tr>
            <td>Potentiel restant:</td>
            <td>
              {(portfolio.potential + +tradeParams.potentialWin).toFixed(0)}
              {currencySymbol}
            </td>
            <td>
              <span className={styles.minus}>
                ({portfolio.potential.toFixed(0)})
              </span>
            </td>
            <td>
              {(
                ((portfolio.potential + +tradeParams.potentialWin) /
                  newCapitalengaged) *
                100
              ).toFixed(2)}
              %
            </td>
            <td>
              <span className={styles.minus}>({portfolio.potentialPc})</span>
            </td>
          </tr>
          <tr>
            <td>Si TP atteints :</td>
            <td>
              {newPerfAtTp.toFixed(0)}
              {currencySymbol}
            </td>
            <td>
              <span className={styles.minus}>
                ({(portfolio.potential + portfolio.currentPv).toFixed(0)})
              </span>
            </td>
            <td>{((newPerfAtTp / newCapitalengaged) * 100).toFixed(2)}%</td>
            <td>
              <span className={styles.minus}>
                (
                {(
                  ((portfolio.potential + portfolio.currentPv) /
                    portfolio.activeK) *
                  100
                ).toFixed(2)}
                )
              </span>
            </td>
          </tr>
          <tr>
            <td>Si stops touchés :</td>
            <td>
              {newPerfAtStop.toFixed(0)}
              {currencySymbol}
            </td>
            <td>
              <span className={styles.minus}>
                ({portfolio.perfIfStopeed.toFixed(0)})
              </span>
            </td>
            <td>{((newPerfAtStop / newCapitalengaged) * 100).toFixed(2)}%</td>
            <td>
              <span className={styles.minus}>
                ({portfolio.perfIfStopeedPc})
              </span>
            </td>
          </tr>

          {/*******************  Risk/reward *************/}

          {newPerfAtTp > 0 && newPerfAtStop < 0 && (
            <tr>
              <td>Risk/Reward :</td>
              <td>{Math.abs(newPerfAtTp / newPerfAtStop).toFixed(2)}</td>
              <td>
                {portfolio.potential + portfolio.currentPv > 0 &&
                  portfolio.perfIfStopeed < 0 && (
                    <span className={styles.minus}>
                      (
                      {Math.abs(
                        (portfolio.potential + portfolio.currentPv) /
                          portfolio.perfIfStopeed
                      ).toFixed(2)}
                      )
                    </span>
                  )}
              </td>
              <td></td>
              <td></td>
            </tr>
          )}

          <tr>
            <td>capital engagé :</td>
            <td>
              {newCapitalengaged.toFixed(0)}
              {currencySymbol}
            </td>
            <td>
              <span className={styles.minus}>
                ({portfolio.activeK.toFixed(0)})
              </span>
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Exposition :</td>

            <td>
              {(+portfolio.assets + values.quantity * lastInfos.last).toFixed(
                0
              )}
              {currencySymbol}
            </td>
            <td>
              <span className={styles.minus}>
                ({portfolio.assets.toFixed(0)})
              </span>
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Liquidités :</td>

            <td>
              {(portfolio.cash - +tradeParams.capitalInvested).toFixed(0)}
              {currencySymbol}
            </td>
            <td>
              <span className={styles.minus}>
                ({portfolio.cash.toFixed(0)})
              </span>
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Valeur liquidative:</td>

            <td>
              {newTotalBalance.toFixed(0)} {currencySymbol}
            </td>
            <td>
              <span className={styles.minus}>
                ({portfolio.totalBalance.toFixed(0)})
              </span>
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Performance totale :</td>
            <td>
              {(newTotalBalance - portfolio.initCredit).toFixed(0)}{" "}
              {currencySymbol}
            </td>
            <td>
              <span className={styles.minus}>
                ({portfolio.totalPerf.toFixed(0)})
              </span>
            </td>
            <td>
              {(
                ((newTotalBalance - portfolio.initCredit) /
                  portfolio.initCredit) *
                100
              ).toFixed(2)}
              %
            </td>
            <td>
              <span className={styles.minus}>({portfolio.totalPerfPc}) </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PortfolioAfter;
