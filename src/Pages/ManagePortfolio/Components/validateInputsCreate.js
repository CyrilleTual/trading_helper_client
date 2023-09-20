/**
 * Valide les valeurs fournies et les nettoie si nécessaire.
 * @param {object} values - Les valeurs à valider.
 * @returns - Un objet contenant les erreurs de validation +/- les valeurs nettoyées.
 */
export function validate(values, currencies, portfolios) {

  const { comment, currencyAbbr, deposit, title } = values;
  const inputErrors = []; // Tableau des erreurs de validation
  let verifiedValues = []; // Tableau des valeurs validées à retourner

  // Vérification du montant du dépot initial
  if (
    isNaN(deposit) || // Vérifie si c'est un nombre
    deposit < 0 || // Vérifie qu'il n'est pas négatif
    deposit > 9999999 || // Vérifie qu'il n'a pas plus de 7 chiffres
    deposit * 1000 - Math.trunc(deposit * 1000) > 0 // Vérifie qu'il n'a pas plus de 3 décimales
  ) {
    inputErrors.push("Veuillez vérifier les données saisies");
    return { inputErrors }; // Sortir de la fonction si un élément est invalide
  }

  // Préparation du commentaire en nettoyant les espaces en début et en fin
  const cleanComment = comment.trim();
  // Vérification de la longueur du commentaire
  if (cleanComment.length > 200) {
    inputErrors.push("Commentaire de 200 caractères maximum SVP.");
    return { inputErrors };
  }

  // Préparation du nom en nettoyant les espaces en début et en fin
  const cleanTitle = title.trim();
  // Vérification de la longueur du commentaire
  if (cleanTitle.length > 100) {
    inputErrors.push("Nom du compte de 100 caractères maximum SVP.");
    return { inputErrors };
  }
  if (cleanTitle.length < 3) {
    inputErrors.push("Nom du compte de 3 caractères minimum SVP.");
    return { inputErrors };
  }

  // verification que le nom du portefeuille n'existe pas pour cet utilisateur 
  if (portfolios.find((elet) => (elet.title).toLowerCase() === cleanTitle.toLowerCase()) !== undefined ) {
    inputErrors.push("Vous avez déja un portefeuille de ce nom.");
    return { inputErrors };
  }
  // verification que la currency existe bien
  if (currencies.find((elet) => elet.abbr === currencyAbbr) === undefined) {
    inputErrors.push("Problème dans le formulaire ");
    return { inputErrors };
  }

  // Les valeurs validées et formatées
  verifiedValues = {
    comment: cleanComment,
    currencyAbbr: currencyAbbr,
    deposit: +deposit,
    title: cleanTitle,
  };

  // Retourne le tableau des erreurs et les valeurs formatées
  return { inputErrors, verifiedValues };
}
