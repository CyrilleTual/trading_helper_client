import React from 'react'
import { useSelector } from 'react-redux';
import { useGetPortfoliosByUserQuery } from '../../store/slice/tradeApi';
import Level2 from './Level2';
 
 

function ShowAllDetails() {
  // recup des caractères de l'user
  // on recupère l'idduuser depuis le store -> id
  const id = useSelector((state) => state.user.infos.id);
  // on chek si visiteur pour adapter l'affichage
  let isVisitor = true;
  if (
    useSelector((state) => state.user.infos.role).substring(0, 7) !== "visitor"
  ) {
    isVisitor = false;
  }

  // on recupère les portefeuilles en fonction de l'id 
  const {
   data: portfolios,
   isLoading: portfolioIsLoading,
   isSuccess: isSuccess1,
   isError: isError1,
 } = useGetPortfoliosByUserQuery(id);

 console.log (portfolios)


  return (<Level2/>);
}

export default ShowAllDetails