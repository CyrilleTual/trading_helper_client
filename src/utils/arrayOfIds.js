// retourne une tableau avec tous les trades et le portefeuille { [portifId,tradeId], [etc...]}

export const arrayOfIdsFct = (trades) => {
  const arrayOfIds = [];
  for (const trade of trades) {
  
    arrayOfIds.push({ portfolioId: trade.portfolioId, tradeId: trade.tradeId });
  }
 return(arrayOfIds);
};

