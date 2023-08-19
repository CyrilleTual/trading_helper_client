/**
 * Valide les valeurs fournies et les nettoie si nécessaire.
 * @param {object} values - Les valeurs à valider.
 * @returns - Un objet contenant les erreurs de validation +/- les valeurs nettoyées.
 */
export function validateAddRemoveFunds(values, portfolios) {
  const { action, amount, portfolioId } = values;
  const inputErrors = []; // Tableau des erreurs de validation
  let verifiedValues = []; // Tableau des valeurs validées à retourner

  // Vérification du montant de la transaction
  if (
    isNaN(amount) || // Vérifie si c'est un nombre
    amount < 0 || // Vérifie qu'il n'est pas négatif
    amount > 9999999 || // Vérifie qu'il n'a pas plus de 7 chiffres
    amount * 1000 - Math.trunc(amount * 1000) > 0 // Vérifie qu'il n'a pas plus de 3 décimales
  ) {
    inputErrors.push("Veuillez vérifier les données saisies");
    return { inputErrors }; // Sortir de la fonction si un élément est invalide
  }

  // verification de l'action
  if (action !== 1 && action !== 2) {
    inputErrors.push("Problème dans le formulaire ");
    return { inputErrors };
  }

  // vérification du portfolio (est bien dans la liste des portfolios de l'utilisateur)
  if ((portfolios.find((elet) => +elet.id === +portfolioId)) === undefined) {
    inputErrors.push("Problème dans le formulaire ");
    return { inputErrors };
  }

  // Les valeurs validées et formatées
  verifiedValues = {
    action: +action,
    amount: +amount,
    portfolioId: portfolioId
  };

  // Retourne le tableau des erreurs et les valeurs formatées
  return { inputErrors, verifiedValues };
}






export function validateIdlePortfolio(values, portfolios) {
  const { portfolioId } = values;
  const inputErrors = []; // Tableau des erreurs de validation
  let verifiedValues = []; // Tableau des valeurs validées à retourner

  // vérification du portfolio (est bien dans la liste des portfolios de l'utilisateur)
  if (portfolios.find((elet) => +elet.id === +portfolioId) === undefined) {
    inputErrors.push("Problème dans le formulaire ");
    return { inputErrors };
  }

  // Les valeurs validées et formatées
  verifiedValues = {
    action: 3,
    amount: 0,
    portfolioId: portfolioId,
  };

  // Retourne le tableau des erreurs et les valeurs formatées
  return { inputErrors, verifiedValues };
}



