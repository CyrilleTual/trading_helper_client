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
  setMetrics({
    ...metrics,
    balance: +balance,
    balancePc: +balancePc * 100,
    potential: +potential.toFixed(3),
    potentialPc: (+potentialPc * 100).toFixed(2),
    risk: +risk.toFixed(3),
    riskPc: +(riskPc * 100).toFixed(2),
    rr: +rr.toFixed(2),
  });
}

export function calculNewMetrics(trade, values, newMetrics, setNewMetrics) {

    
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
        ? (values.target - trade.pru) * trade.remains
        : (trade.pru - values.target) * trade.remains;
    const potentialPc =
      trade.position === "long"
        ? (values.target - trade.pru) / trade.pru
        : (trade.pru - values.target) / trade.pru;
    const risk =
      trade.position === "long"
        ? (values.stop - trade.pru) * trade.remains
        : (trade.pru - values.stop) * trade.remains;
    const riskPc =
      trade.position === "long"
        ? (values.stop - trade.pru) / trade.pru
        : (trade.pru - values.stop) / trade.pru;
    const rr = risk < 0 ? -potential / risk : 0;

    setNewMetrics({
      ...newMetrics,
      valid: true,
      potential: +potential.toFixed(3),
      potentialPc: (+potentialPc * 100).toFixed(2),
      risk: +risk.toFixed(3),
      riskPc: (+riskPc * 100).toFixed(2),
      rr: +rr.toFixed(2),
    });
  }else{
    setNewMetrics({
        ...newMetrics,
        valid:false
    })
  }

   
   
}
