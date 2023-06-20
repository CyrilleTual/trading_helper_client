import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetPortfolioDashboardByIdQuery } from '../../store/slice/tradeApi';
import { NavLink } from 'react-router-dom';

function Portfolio() {
    const {portfolioId} = useParams();
    // on va cherhcher un portfolio particulier
     const { data, isLoading } =
       useGetPortfolioDashboardByIdQuery(portfolioId);

      // console.log(data)

  return (
    <>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <>
          <p>+/- value latente : {data.currentPv}</p>
          <p>cash total versé : {data.initCredit}</p>
          <NavLink to={`/portfolio/detail/${data.id}`}>
            Details
          </NavLink>
        </>
      )}
    </>
  );
}

export default Portfolio