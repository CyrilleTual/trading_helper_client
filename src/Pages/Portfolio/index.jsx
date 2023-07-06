import { useParams } from "react-router-dom";
import { useGetPortfolioDashboardByIdQuery } from "../../store/slice/tradeApi";
import PerfMeter from "../../Components/PerfMeter/Index";
import PortTable from "../../Components/PortTable";
import styles from "./portfolio.module.css";
import BtnLink from "../../Components/UI/BtnLink";
import { useEffect } from "react";
import { resetStorage } from "../../utils/tools";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../store/slice/user";
import TradingViewWidget from "../TradingViewWidget/Index"

function Portfolio() {
  const { portfolioId } = useParams();
  // on va cherhcher un portfolio particulier
  const { data, isLoading, isError } =
    useGetPortfolioDashboardByIdQuery(portfolioId);

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
          <main className={styles.portfolio}>
            <h1>Tableau de bord</h1>
            <div className={styles.meter_container}>
              <PerfMeter
                legend="Trades actifs"
                min={data.perfIfStopeed}
                max={data.potential}
                perf={data.currentPv}
                meterWidth={styles.meterWidth}
                meterHeight={styles.meterHeight}
              />
            </div>

            <PortTable datas={data} baseCurrencie={baseCurrencie} />
            {/* <NavLink to={`/portfolio/detail/${data.id}`}>Details</NavLink> */}
            {data.assets > 0 && (
              <div className={styles.under_table}>
                {/* <div className={styles.tradingViewContainer}>
                       <TradingViewWidget />
                </div> */}
                <span>
                  <BtnLink
                    link={`/portfolio/detail/${data.id}`}
                    title="Details"
                  />
                </span>
              </div>
            )}
          </main>
        )
      )}
    </>
  );
}

export default Portfolio;
