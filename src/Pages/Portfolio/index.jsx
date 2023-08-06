import { useParams } from "react-router-dom";
import { useGetPortfolioDashboardByIdQuery, useGetCurrenciesQuery } from "../../store/slice/tradeApi";
import PerfMeter from "../../Components/PerfMeter/Index";
import PortTable from "../../Components/PortTable";
import styles from "./portfolio.module.css";
import BtnLink from "../../Components/UI/BtnLink";
import { useEffect, useState } from "react";
import { resetStorage } from "../../utils/tools";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../store/slice/user";
import { Loading } from "../../Components/Loading/Index";
 

function Portfolio() {

  const { portfolioId } = useParams();
  // on va cherhcher un portfolio particulier
  const { data, isLoading, isError } =
    useGetPortfolioDashboardByIdQuery(portfolioId);
  

  const [baseCurrencie, setBaseCurrencie] = useState ("")  
  // recup des infos sur les currrencies (toutes)
  const { data: currencyInfos } = useGetCurrenciesQuery();

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

  // set de la currency
  useEffect(() => {
    if ( data && currencyInfos) {
      const portfolioCurrencie = currencyInfos.find ( el => el.id === data.currencyId)
      setBaseCurrencie(portfolioCurrencie.symbol);
    }
  }, [ data, currencyInfos]);
 

  return (
    <>
      {isLoading ? (
        <Loading/>
      ) : (
        !isError &&
        baseCurrencie && (
          <main className={styles.portfolio}>
            <h1>Tableau de bord</h1>
            <div className={styles.meter_container}>
              <PerfMeter
                legend="Trades actifs"
                min={data.perfIfStopeed.toFixed(0)}
                max={(data.potential + data.currentPv).toFixed(0)}
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
                    link={`/portfolio/${data.id}/detail`}
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
