import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../../store/slice/user";
import { resetStorage } from "../../../utils/tools";
import {
  useGetCurrenciesQuery,
  useGetGlobalDashBoardByUserQuery,
} from "../../../store/slice/tradeApi";

import styles from "./details.module.css"


function Details({ portfolio }) {
 
  // gestion de l'id de l'user à suivre
  let id = useSelector((state) => state.user.infos.id);
  const role = useSelector((state) => state.user.infos.role);
  // si visitor -> on change id
  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
  }

  // on va chercher la tableau de bord global pour un  (idUser) *************************
  const {
    data: global,
    isLoading,
    isError,
  } = useGetGlobalDashBoardByUserQuery(id);

  // puis on recupère le portfolio par son id  *******************************************
  const [data, setData] = useState(null);

  useEffect(() => {
    if (global) {
      setData(
        global.portfoliosArray.find((item) => +item.id === +portfolio.id)
      );
    }
    // eslint-disable-next-line
  }, [global]);

  //-------------------------------------------------------------------------------

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

  // set de la devise de base
  const [baseCurrencie, setBaseCurrencie] = useState("");
  // recup des infos sur les currrencies (toutes)
  const { data: currencyInfos } = useGetCurrenciesQuery();
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
        <tr>
          <td>Loading</td>
        </tr>
      ) : (
        !isError && data && (
          <tr>
            <td
              className={styles.toinfo}
              datainfo={`portefeuille : ${portfolio.title}`}
            >
              {portfolio.title}
            </td>
            <td>{baseCurrencie}</td>
            <td>{+data.initCredit.toFixed(0)}</td>
            <td>{data.assets.toFixed(0)}</td>
            <td>{data.cash.toFixed(0)}</td>
            <td>{data.totalBalance.toFixed(0)}</td>
          </tr>
        )
      )}
    </>
  );
}

export default Details;
