import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../../store/slice/user";
import { resetStorage } from "../../../utils/tools";
import { useGetPortfolioDashboardByIdQuery } from "../../../store/slice/tradeApi";
import styles from "./details.module.css";

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
  }, [isError]);

  // set de la devise de base
  const baseCurrencie = "€";

  return (
    <>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        !isError && (
          <tr>
            <td>{portfolio.title}</td>
            <td>
              {data.initCredit} {baseCurrencie}
            </td>
            <td>
              {data.assets} {baseCurrencie}
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
