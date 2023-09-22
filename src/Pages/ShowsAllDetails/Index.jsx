import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useGetPortfoliosByUserQuery, useGetTradesActivesByUserQuery } from '../../store/slice/tradeApi';

import { Loading } from '../../Components/Loading/Index';
import { prepare } from './utils';
import Card from './Card';

 
 

function ShowAllDetails() {
  
  /// gestion du statut visiteur //////////////////////////////////////

  const role = useSelector((state) => state.user.infos.role);
  let id = useSelector((state) => state.user.infos.id);
  let isVisitor = false ;

  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
    isVisitor = true;
  }

  ////// preparation des variables utilisées ici 
  const [show, setShow] = useState ({
    trades: [],
    tradesIds: [],
    portfoliosIds: [],
    selectedTradeId: null,
  })


  // Récupère tous les trades ouverts par id d'user
  const {
    data: originalsTrades,
    isLoading: tradesIsLoading,
    isSuccess: tradesisSuccess,
    isError: tradesisError1,
  } = useGetTradesActivesByUserQuery(id);

  // peuple les variables utilisées pour passer à la card les infos 
  useEffect(() => {
    if (tradesisSuccess) {
      const { trades, tradesIds, portfoliosIds } = prepare(originalsTrades);
      setShow ( {...show, 
        trades:trades, 
        tradesIds:tradesIds,
        selectedTradeId:tradesIds[0],
        portfoliosIds:portfoliosIds})
    }
  }, [tradesisSuccess]);

  console.log (show.trades)

  return (
    <>
      {!tradesisSuccess ? (
        <Loading />
      ) : (
        <>
          <Card/>
        </>
      )}
    </>
  );
}

export default ShowAllDetails