import styles from "./portTable.module.css"

function PortTable({datas, baseCurrencie}) {
  return (
    <table className={styles.portTable}>
      <tbody>
        <tr>
          <td className={styles.col1}>+/- value latente :</td>
          <td className={styles.col2}>
            {datas.currentPv} {baseCurrencie}
          </td>
          <td className={styles.col3}>{datas.currentPvPc}%</td>
        </tr>
        <tr>
          <td>variation jour :</td>
          <td>
            {datas.dailyVariation} {baseCurrencie}
          </td>
          <td>{datas.dailyVariationPc}%</td>
        </tr>
        <tr>
          <td>Potentiel position ouvertes :</td>
          <td>
            {datas.potential} {baseCurrencie}
          </td>
          <td>{datas.potentialPc}%</td>
        </tr>
        <tr>
          <td>Perf si stops touchés :</td>
          <td>
            {datas.perfIfStopeed} {baseCurrencie}
          </td>
          <td>{datas.perfIfStopeedPc}%</td>
        </tr>
        <tr>
          <td>cash total versé :</td>

          <td>
            {datas.initCredit} {baseCurrencie}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>Exposition :</td>

          <td>
            {datas.assets} {baseCurrencie}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>Liquidités :</td>

          <td>
            {datas.cash} {baseCurrencie}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>Valorisation totale :</td>

          <td>
            {datas.totalBalance} {baseCurrencie}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>Performance totale :</td>
          <td>
            {datas.totalPerf} {baseCurrencie}
          </td>
          <td>{datas.totalPerfPc} %</td>
        </tr>
      </tbody>
    </table>
  );
}

export default PortTable