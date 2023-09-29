import { useEffect, useState } from "react";
import { useGetMovementsByTradeIdQuery } from "../../store/slice/tradeApi";
import { sort, datetimeToFrShort } from "../../utils/tools.js";
import { Loading } from "../../Components/Loading/Index";

function Movements({ tradeId, symbol }) {
  if (typeof tradeId === "undefined") tradeId = 1;

  // brings the movements for a trade
  const { data, isSuccess } = useGetMovementsByTradeIdQuery(tradeId);

  const [mvts, setMvts] = useState ([]);

  useEffect(() => {
    let enters = [];
    let closures = [];
    let adjustments = [];

    if (isSuccess) {
      const { enter, closure, adjustment } = data;
      enter.forEach((element) => {
        enters.push({ ...element, type: "enter" });
      });
      closure.forEach((element) => {
        closures.push({ ...element, type: "closure" });
      });
      adjustment.forEach((element) => {
        adjustments.push({ ...element, type: "adjustment" });
      });

      // array contenant tous les mouvements
      const totalMvts = [...enters, ...closures, ...adjustments];

      // trie des mouvements par date
      setMvts(sort(totalMvts, ["date"])) ;

    }
  }, [data]);



  return (
    <>
      {mvts.length === 0 ? (
        <Loading />
      ) : (
        <>
          {mvts.map((mvt, key) => (
            <article key={key}>
              {mvt.type === "enter" && (
                <>
                  Le {datetimeToFrShort(mvt.date)}, entrée sur {+mvt.quantity}{" "}
                  titres, PU {+mvt.price}, taxes: {+mvt.tax}, frais: {+mvt.fees}{" "}
                  coût total :{" "}
                  {(+mvt.quantity * +mvt.price + +mvt.tax + +mvt.fees).toFixed(
                    2
                  )}
                </>
              )}
              {mvt.type === "closure" && (
                <>
                  Le {datetimeToFrShort(mvt.date)} vente de {+mvt.quantity}{" "}
                  titres, PU {+mvt.price}, taxes: {+mvt.tax}, frais: {+mvt.fees}
                </>
              )}
              {mvt.type === "adjustment" && (
                <>Le {datetimeToFrShort(mvt.date)} ajustement, Stop à {mvt.stop}, Objectif à {mvt.target}</>
              )}
            </article>
          ))}
        </>
      )}
    </>
  );
}

export default Movements;
