export function utilsMeter (trade){
  // verification de la validité du stop et tp pour mascage du meter
  const meterInvalid =
    (trade.position === "long" &&
      trade.stop < trade.tradeQuote &&
      trade.target > trade.tradeQuote) ||
    (trade.position === "short" &&
      trade.target < trade.tradeQuote &&
      trade.stop > trade.tradeQuote)
      ? false
      : true;

  const situation =
    meterInvalid &&
    ((trade.position === "long" && trade.lastQuote > trade.target) ||
      (trade.position === "short" && trade.lastQuote < trade.target)) ? (
      <>
        Objectif Atteint. <br />
        {trade.potential > 0 ? `Gain de ` : `Perte`} {trade.potential}{" "}
        {trade.symbol} soit {trade.potentialPc} %.
      </>
    ) : (
      <>
        Stop touché, <br />
        {trade.risk < 0 ? `perte de ` : "gain de "}
        {trade.risk} {trade.symbol} soit {trade.riskPc} %.
      </>
    );

    return {meterInvalid, situation}
}