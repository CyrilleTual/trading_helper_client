import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetGlobalDashBoardByUserQuery } from "../../store/slice/tradeApi";
import { signOut } from "../../store/slice/user";
import { resetStorage } from "../../utils/tools";
import styles from "./globalPortfolio.module.css";
import {Loading}  from "../../Components/Loading/Index";
import Alltrades from "../AllTrades/Index";
import PerfMeter from "../../Components/PerfMeter/Index";

const PortTable = lazy(() => import("../../Components/PortTable"));
 
function Global() {
  // Recupère l'id user depuis le store -> id
  const role = useSelector((state) => state.user.infos.role);

  let id = useSelector((state) => state.user.infos.id);

  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
  }
  // on va chercher la tableau de bord global pour un user (idUser)
  const {
    data: global,
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
    // eslint-disable-next-line
  }, [isError]);

  // set de la devise de base
  const [baseCurrencie, setbaseCurrencie] = useState("");
  useEffect(() => {
    if (global) {
      setbaseCurrencie(global.currencySymbol);
    }
  }, [global]);

  return (
    <>
      {!global ? (
        <Loading />
      ) : (
        !isError && (
          <>
            <main className={styles.global_portfolio}>
              <h1>Tableau de bord</h1>
              <h2>Trades actifs </h2>
              <div className={styles.wrapper}>
                <div className={styles.meter_container}>
                  <PerfMeter
                    legend="Trades actifs"
                    min={global.perfIfStopeed.toFixed(0)}
                    max={(global.potential + global.currentPv).toFixed(0)}
                    perf={global.currentPv}
                    meterWidth={styles.meterWidth}
                    meterHeight={styles.meterHeight}
                  />
                </div>
                <Suspense fallback={<p> </p>}>
                  <PortTable datas={global} baseCurrencie={baseCurrencie} />
                </Suspense>
              </div>

              <h2>Apperçu des positions</h2>
              <Alltrades />
            </main>
          </>
        )
      )}
    </>
  );
}

export default Global;
