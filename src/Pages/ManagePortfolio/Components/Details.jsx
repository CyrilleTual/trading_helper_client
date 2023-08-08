import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../../store/slice/user";
import { resetStorage } from "../../../utils/tools";
import {
  useGetPortfolioDashboardByIdQuery,
  useGetCurrenciesQuery
} from "../../../store/slice/tradeApi";


function Details({ portfolio }) {
  // on va cherhcher un portfolio particulier

  const { data, isLoading, isError } = useGetPortfolioDashboardByIdQuery(
    portfolio.id
  );

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
        (el) => el.id === data.currencyId
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
        !isError && (
          <tr>
            <td>{portfolio.title}</td>
            <td>
              {+data.initCredit} {baseCurrencie}
            </td>
            <td>
              {data.assets.toFixed(0)} {baseCurrencie}
            </td>
            <td>
              {data.cash} {baseCurrencie}
            </td>
            <td>
              {data.totalBalance} {baseCurrencie}
            </td>
          </tr>
        )
      )}
    </>
  );
}

export default Details;
