import React from 'react'
import { useSelector } from 'react-redux';
import { useGetGlobalDashBoardByUserQuery } from '../../store/slice/tradeApi';


function Global(){
  // on recupère l'idduuser depuis le store -> id
  const { id } = useSelector((state) => ({
    ...state.user.infos,
  }));

  // on va chercher la tableau de bord global pour un user (idUser)

  const { data: global, isLoading } = useGetGlobalDashBoardByUserQuery(id);



  return (
    <>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <>
          <p>+/- value latente : {global.currentPv}</p>
          <p>cash total versé : {global.initCredit}</p>
        </>
      )}
    </>
  );


}




export default Global