import { useParams } from "react-router-dom";
import {

  useGetGlobalDashBoardByUserQuery,
  useGetCurrenciesQuery,
  useGetPortfoliosByUserQuery,
} from "../../store/slice/tradeApi";
import PerfMeter from "../../Components/PerfMeter/Index";
import PortTable from "../../Components/PortTable";
import styles from "./portfolio.module.css";
import BtnLink from "../../Components/UI/BtnLink";
import { useEffect, useState } from "react";
import { resetStorage } from "../../utils/tools";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../store/slice/user";
import { Loading } from "../../Components/Loading/Index";
import Alltrades from "../AllTrades/Index";

function Portfolio() {
  const [portTitle, setPortTitle] = useState("");

  // liste des portfolios de l'user
  let id = useSelector((state) => state.user.infos.id);

  const role = useSelector((state) => state.user.infos.role);

  // si visitor -> on change id
  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
  }

  const { data: portfolios, isSuccess: isSuccess1 } =
    useGetPortfoliosByUserQuery(id);

  const { portfolioId } = useParams();
  // on va cherhcher un portfolio particulier
  // const { data, isLoading, isError } =
  //   useGetPortfolioDashboardByIdQuery(portfolioId);

  // on va chercher la tableau de bord global pour un user (idUser) *************************
  const {
    data: global,
    isLoading,
    isError,
  } = useGetGlobalDashBoardByUserQuery(id);

  // puis on recupère le portfolio par son id  *******************************************
  const [data, setData]= useState(null)

  useEffect(()=>{
    if(global){
      setData(
        global.portfoliosArray.find(
          (portfolio) => +portfolio.id === +portfolioId
        )
      );
    }
  },[global])

  //-------------------------------------------------------------------------------


  // recup du nom du portefeuille
  useEffect(() => {
    if (portfolios && isSuccess1 && data) {
      let { title } = portfolios.find(
        (portfolio) => +portfolio.id === +data.id
      );
      setPortTitle(title, data);
    }
    // eslint-disable-next-line
  }, [portfolios, data]);

  const [baseCurrencie, setBaseCurrencie] = useState("");
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
    if (data && currencyInfos) {
      const portfolioCurrencie = currencyInfos.find(
        (el) => el.abbr === data.currencyAbbr
      );
      setBaseCurrencie(portfolioCurrencie.symbol);
    }
  }, [data, currencyInfos]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        !isError &&
        baseCurrencie && (
          <main className={styles.portfolio}>
            <h1>Tableau de bord</h1>
            <h2>Situation du portefeuille</h2>
            <div className={styles.meter_container}>
              <PerfMeter
                legend={`Trades actifs - ${portTitle}`}
                min={data.perfIfStopeed.toFixed(0)}
                max={(data.potential + data.currentPv).toFixed(0)}
                perf={data.currentPv}
                meterWidth={styles.meterWidth}
                meterHeight={styles.meterHeight}
              />
            </div>

            <PortTable datas={data} baseCurrencie={baseCurrencie} />

            {data.assets > 0 && (
              <div className={styles.under_table}>
                <span>
                  <BtnLink
                    link={`/portfolio/${data.id}/detail`}
                    title={`tableau des trades - ${portTitle}`}
                    name="détails"
                  />
                </span>
              </div>
            )}
            <h2>Les trades en cours </h2>
            <Alltrades portfolioId={portfolioId} />
          </main>
        )
      )}
    </>
  );
}

export default Portfolio;
