export function calculNewMetrics(trade, values, newMetrics, setNewMetrics) {

  const remains = +trade.enterQuantity - trade.closureQuantity;

  if (
    (trade.position === "long" &&
      +values.target >= +trade.lastQuote &&
      +values.stop <= +trade.lastQuote) ||
    ((trade.position === "short") &&
      (+values.target <= +trade.lastQuote) &&
      (+values.stop >= +trade.lastQuote))
  ) {
    const potential =
      trade.position === "long"
        ? (values.target - trade.pru) * remains
        : (trade.pru - values.target) * remains;
    const potentialPc =
      trade.position === "long"
        ? (values.target - trade.pru) / trade.pru
        : (trade.pru - values.target) / trade.pru;
    const risk =
      trade.position === "long"
        ? (values.stop - trade.pru) * remains
        : (trade.pru - values.stop) * remains;
    const riskPc =
      trade.position === "long"
        ? (values.stop - trade.pru) / trade.pru
        : (trade.pru - values.stop) / trade.pru;
    const rr = risk < 0 ? -potential / risk : 0;

    const targetAtPc = (values.target - trade.lastQuote) / trade.lastQuote;
    const riskAtPc = (values.stop - trade.lastQuote) / trade.lastQuote;

    setNewMetrics({
      ...newMetrics,
      valid: true,
      potential: +potential.toFixed(3),
      potentialPc: (+potentialPc * 100).toFixed(2),
      risk: +risk.toFixed(3),
      riskPc: (+riskPc * 100).toFixed(2),
      rr: +rr.toFixed(2),
      targetAtPc: (targetAtPc * 100).toFixed(2),
      riskAtPc: (riskAtPc * 100).toFixed(2),
    });
  }else{
    setNewMetrics({
        ...newMetrics,
        valid:false
    })
  }

   
   
}
