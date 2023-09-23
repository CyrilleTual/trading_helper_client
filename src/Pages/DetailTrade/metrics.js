export function calculMetrics(trade, metrics, setMetrics) {
  const balance = +(
    trade.position === "long"
      ? (trade.lastQuote - trade.pru) * trade.remains
      : (trade.pru - trade.lastQuote) * trade.remains
  ).toFixed(0);

  const balancePc = +(
    trade.position === "long"
      ? (trade.lastQuote - trade.pru) / trade.pru
      : (trade.pru - trade.lastQuote) / trade.pru
  ).toFixed(2);

  const potential =
    trade.position === "long"
      ? (trade.target - trade.pru) * trade.remains
      : (trade.pru - trade.target) * trade.remains;
  const potentialPc =
    trade.position === "long"
      ? (trade.target - trade.pru) / trade.pru
      : (trade.pru - trade.target) / trade.pru;
  const risk =
    trade.position === "long"
      ? (trade.stop - trade.pru) * trade.remains
      : (trade.pru - trade.stop) * trade.remains;
  const riskPc =
    trade.position === "long"
      ? (trade.stop - trade.pru) / trade.pru
      : (trade.pru - trade.stop) / trade.pru;
  const rr = risk < 0 ? -potential / risk : 0;

  const targetAtPc = (trade.target - trade.lastQuote) / trade.lastQuote;
  const riskAtPc = (trade.stop - trade.lastQuote) / trade.lastQuote;

  // verification de la validité du stop et tp 
  const isValid = 
  (trade.position === "long" && trade.stop < trade.lastQuote && trade.target > trade.lastQuote) ||
  (trade.position === "short" && trade.target < trade.lastQuote && trade.stop > trade.lastQuote)
    ? true: false; 

  setMetrics({
    ...metrics,
    balance: +balance,
    balancePc: +balancePc * 100,
    potential: +potential.toFixed(3),
    potentialPc: (+potentialPc * 100).toFixed(2),
    risk: +risk.toFixed(3),
    riskPc: +(riskPc * 100).toFixed(2),
    rr: +rr.toFixed(2),
    targetAtPc: (targetAtPc * 100).toFixed(2),
    riskAtPc: (riskAtPc * 100).toFixed(2),
    isValid: isValid,
  });
}

 