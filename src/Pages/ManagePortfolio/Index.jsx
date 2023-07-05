import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetPortfoliosByUserQuery,
  useGetPortfolioDashboardByIdQuery,
} from "../../store/slice/tradeApi";
import styles from "./managePortfolio.module.css";

function ManagePortfolio() {
  const id = useSelector((state) => state.user.infos.id);

  const baseCurrencie = "$";

  // liste des portfolios
  const {
    data: portfolios,
    isLoading,
    isError,
  } = useGetPortfoliosByUserQuery(id);

  // on va cherhcher un portfolio particulier

  const [skip, setSkip] = useState(true);
  const [idCurrent, setIdCurrent] = useState(1);

  const { data: portfoliodetail } =
    useGetPortfolioDashboardByIdQuery(idCurrent);

  useEffect(() => {
    setSkip(false);
    for (const portfolio of portfolios) {
      console.log(portfolio, portfolio.id);
      setIdCurrent(portfolio.id);
    }
  }, [portfolios]);

  const arrayDetailled = [];
  useEffect(() => {
    
   console.log(portfoliodetail)

  }, [idCurrent, portfoliodetail]);



  return <>{isLoading ? <p>loading</p> : <div>toto</div>}</>;
}

export default ManagePortfolio;
