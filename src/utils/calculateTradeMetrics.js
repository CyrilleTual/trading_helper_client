export function calculMetrics (trade){

  /// si on est sur stop ou objectif  tradeQuote = stop ou objectif
  // ne pas confondre tradeQuote et lastQuote !!!!
  let tradeQuote = null;
  if (trade.position === "long") {
    if (trade.lastQuote > trade.target) {
      tradeQuote = trade.target;
    } else if (trade.lastQuote < trade.stop) {
      tradeQuote = trade.stop;
    } else {
      tradeQuote = trade.lastQuote;
    }
  } else if (trade.position === "short") {
    if (trade.lastQuote < trade.target) {
      tradeQuote = trade.target;
    } else if (trade.lastQuote > trade.stop) {
      tradeQuote = trade.stop;
    } else {
      tradeQuote = trade.lastQuote;
    }
  }

  const balance = +(
    trade.position === "long"
      ? (+tradeQuote - trade.neutral) * trade.actualQuantity
      : (+trade.neutral - tradeQuote) * trade.actualQuantity
  ).toFixed(2);


 

  const balancePc = +(
    trade.position === "long"
      ? ((tradeQuote - trade.neutral) / trade.neutral) * 100
      : ((trade.neutral - tradeQuote) / trade.neutral) * 100
  ).toFixed(2);

  const potential = (
    trade.position === "long"
      ? (trade.target - trade.neutral) * trade.actualQuantity
      : (trade.neutral - trade.target) * trade.actualQuantity
  ).toFixed(2);

  const potentialPc = (
    trade.position === "long"
      ? ((trade.target - trade.neutral) / trade.neutral) * 100
      : ((trade.neutral - trade.target) / trade.neutral) * 100
  ).toFixed(2);
  const risk = (
    trade.position === "long"
      ? (trade.stop - trade.neutral) * trade.actualQuantity
      : (trade.neutral - trade.stop) * trade.actualQuantity
  ).toFixed(2);

  const riskPc = (
    trade.position === "long"
      ? (trade.stop - trade.neutral) / trade.neutral*100
      : ((trade.neutral - trade.stop) / trade.neutral) * 100
  ).toFixed(2);
  const rr = (risk < 0 ? -potential / risk : 0).toFixed(2);

  const targetAtPc = (((trade.target - tradeQuote) / tradeQuote) * 100).toFixed(2);
  const riskAtPc = (((trade.stop - tradeQuote) / tradeQuote) * 100).toFixed(2);

  ////////////  on complete le trade 
   const tradeFull = {
     ...trade,
     tradeQuote: tradeQuote,
     balance: balance,
     balancePc: balancePc,
     potential: potential,
     potentialPc: potentialPc,
     risk: risk,
     riskPc: riskPc,
     rr: rr,
     targetAtPc: targetAtPc,
     riskAtPc: riskAtPc,
   };

   

   return {
     tradeFull,
       tradeQuote,
       balance,
       balancePc,
       potential,
       potentialPc,
       risk,
       riskPc,
       rr,
       targetAtPc,
       riskAtPc
   };

}