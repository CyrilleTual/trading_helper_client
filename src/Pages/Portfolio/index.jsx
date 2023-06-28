import React from "react";
import { useParams } from "react-router-dom";
import { useGetPortfolioDashboardByIdQuery } from "../../store/slice/tradeApi";
import { NavLink } from "react-router-dom";
import PerfMeter from "../../Components/PerfMeter/Index";
import PortTable from "../../Components/PortTable";
import styles from "./portfolio.module.css";
import BtnLink from "../../Components/UI/BtnLink";

function Portfolio() {
  const { portfolioId } = useParams();
  // on va cherhcher un portfolio particulier
  const { data, isLoading } = useGetPortfolioDashboardByIdQuery(portfolioId);

  // set de la devise de base
  const baseCurrencie = "€";

  return (
    <>
      {isLoading ? (
        <p>Loading</p>
      ) : (
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
          <div className={styles.under_table}>
            <span className="basicBtn">
              <BtnLink link={`/portfolio/detail/${data.id}`} title="Details" />
            </span>
          </div>
        </main>
      )}
    </>
  );
}

export default Portfolio;
