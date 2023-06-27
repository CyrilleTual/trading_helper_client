import { useSelector } from 'react-redux';
import { useGetGlobalDashBoardByUserQuery } from '../../store/slice/tradeApi';
import styles from "./globalPortfolio.module.css"
import PerfMeter from '../../Components/PerfMeter/Index';


function Global(){
  // on recupère l'idduuser depuis le store -> id
  const id = useSelector((state) => state.user.infos.id);

  // on va chercher la tableau de bord global pour un user (idUser)
  const { data: global, isLoading } = useGetGlobalDashBoardByUserQuery(id);

  return (
    <>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <main>
          <h1>Tableau de bord</h1>
          <div className={styles.meter_container}>
            <PerfMeter
              legend="Trades actifs"
              min={global.perfIfStopeed}
              max={global.potential}
              perf={global.currentPv}
              meterWidth={styles.meterWidth}
              meterHeight={styles.meterHeight}
            />
          </div>

          <table>
            <caption>Synthèse de tout les comptes</caption>
            <tr>
              <td>+/- value latente :</td>
              <td>{global.currentPv}</td>
              <td>{global.currentPvPc}%</td>
            </tr>
            <tr>
              <td>variation jour :</td>
              <td>{global.dailyVariation}</td>
              <td>{global.dailyVariationPc}%</td>
            </tr>
            <tr>
              <td>Potentiel position ouvertes :</td>
              <td>{global.potential}</td>
              <td>{global.potentialPc}%</td>
            </tr>
            <tr>
              <td>Perf si stops touchés :</td>
              <td>{global.perfIfStopeed}</td>
              <td>{global.perfIfStopeedPc}%</td>
            </tr>
            <tr>
              <td>cash total versé :</td>
              <td></td>
              <td>{global.initCredit}</td>
            </tr>
            <tr>
              <td>Exposition :</td>
              <td></td>
              <td>{global.assets}</td>
            </tr>
            <tr>
              <td>Liquidités :</td>
              <td></td>
              <td>{global.cash}</td>
            </tr>
            <tr>
              <td>Valorisation totale :</td>
              <td></td>
              <td>{global.totalBalance}</td>
            </tr>
            <tr>
              <td>Performance totale :</td>
              <td>{global.totalPerf}</td>
              <td>{global.totalPerfPc}</td>
            </tr>
          </table>
        </main>
      )}
    </>
  );
}




export default Global