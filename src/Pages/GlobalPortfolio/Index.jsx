import { useSelector } from "react-redux";
import { useGetGlobalDashBoardByUserQuery } from "../../store/slice/tradeApi";
import styles from "./globalPortfolio.module.css";
import PerfMeter from "../../Components/PerfMeter/Index";
import PortTable from "../../Components/PortTable";
import { useEffect } from "react";
import { resetStorage } from "../../utils/tools";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../store/slice/user";

function Global() {
  // on recupère l'idduuser depuis le store -> id
  const id = useSelector((state) => state.user.infos.id);

  // on va chercher la tableau de bord global pour un user (idUser)
  const {
    data: global,
    isLoading,
    isError,
  } = useGetGlobalDashBoardByUserQuery(id);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
      if (isError) {
        resetStorage();
        // on reset le state
        dispatch(signOut());
        navigate("/");
      }
    }, [isError]);

  // set de la devise de base
  const baseCurrencie = "€";

  return (
    <>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        !isError && (
          <>
            <main className={styles.global_portfolio}>
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

              <PortTable datas={global} baseCurrencie={baseCurrencie} />
            </main>
          </>
        )
      )}
    </>
  );
}

export default Global;
