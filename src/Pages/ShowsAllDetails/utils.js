/**
 * Trie un tableau de trades en fonction de l'identifiant du portefeuille puis de la date d'achat.
 * @param {Array} trades - Le tableau de trades à trier.
 * @returns {Array} - Le tableau trié.
 */
function sort(trades) {
  let copy = [...trades]; // Crée une copie du tableau sinon erreur -> immutable
  return copy.sort(function compare(a, b) {
    const criteres = ["portfolioId", "firstEnter"];
    // Parcourt les critères de tri
    for (const critere in criteres) {
      // Compare les valeurs des critères pour les deux trades
      if (a[criteres[critere]] != b[criteres[critere]]) {
        // Si les valeurs sont différentes, renvoie 1 si a est supérieur, sinon -1
        return a[criteres[critere]] > b[criteres[critere]] ? 1 : -1;
      }
    }
    // Si tous les critères sont identiques, renvoie 0 (les trades sont équivalents en termes de tri)
    return 0;
  });
}



export function prepare(originalsTrades) {
  const trades = sort(originalsTrades);

  // recupère la liste des  id des portefeilles  en retirant les doublons
  const portfoliosIds = [...new Set(trades.map((trade) => trade.portfolioId))];
  // liste des id de trades
  const tradesIds = trades.map((trade) => trade.tradeId);

  return ({trades, tradesIds, portfoliosIds}); 
}
