 
 
 

function DetailPorfolio() {
 

    let myLabels = [
      "tradeId",
      "title",
      "last",
      "position",
      "pru",
      "currentPv",
      "currentPvPc",
      "potential",
      "potentialPc",
      "perfIfStopeed",
      "perfIfStopeedPc",
      "dailyVariation",
      "dailyVariationPc",
      "target",
      "stop",
      "initialValue",
      "actualValue",
      "nbActivesShares",
    ];
 
  return (
    <>
 
            <div>
              {myLabels.map((element, i) => (
                <tr key={i}>
                  <td>{element}</td>
                </tr>
              ))}
            </div>
 
    </>
  );
}

export default DetailPorfolio;
