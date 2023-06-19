import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetPortfolioDashboardByIdQuery } from '../../store/slice/tradeApi';

function Portfolio() {
    const {portfolioId} = useParams();
    // on va cherhcher un portfolio particulier
     const { data, isLoading } =
       useGetPortfolioDashboardByIdQuery(portfolioId);

  return (
    <>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <>
          <p>+/- value latente : {data.currentPv}</p>
          <p>cash total versé : {data.initCredit}</p>
        </>
      )}
    </>
  );
}

export default Portfolio