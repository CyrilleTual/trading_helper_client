/**
 * Valide les valeurs fournies et les nettoie si nécessaire.
 * @param {object} values - Les valeurs à valider.
 * @returns - Un objet contenant les erreurs de validation et les valeurs nettoyées.
 */
export function validate(values, maxQuantity) {
  const { price, quantity, fees, tax, comment, date } = values;

  const inputErrors = []; // Tableau des erreurs de validation
  let verifiedValues = []; // Tableau des valeurs validées à retourner

  // Vérification que les champs numériques sont bien numériques et non négatifs
  const mustBeNumbers = [price, quantity, fees, tax];
  for (const value of mustBeNumbers) {
    if (
      isNaN(value) || // Vérifie si c'est un nombre
      value < 0 || // Vérifie qu'il n'est pas négatif
      value > 9999999 || // Vérifie qu'il n'a pas plus de 7 chiffres
      value * 1000 - Math.trunc(value * 1000) > 0 // Vérifie qu'il n'a pas plus de 3 décimales
    ) {
      inputErrors.push("Veuillez vérifier les données saisies");
      return { inputErrors }; // Sortir de la fonction si un élément est invalide
    }
  }

  // Vérification de la cohérence de la quantité saisies
  if (+quantity > +maxQuantity) {
    inputErrors.push("Vérifiez la quantité saisie");
    return { inputErrors };  
  }

  // Préparation du commentaire en nettoyant les espaces en début et en fin
  const cleanComment = comment.trim();
  // Vérification de la longueur du commentaire
  if (cleanComment.length > 200) {
    inputErrors.push("Commentaire de 200 caractères maximum SVP.");
    return { inputErrors };  
  }

  // vérification du format de la date ////////////////////////////
  if (isNaN(new Date(date).getTime())) {
    inputErrors.push("Date non valide");
    return { inputErrors };  
  }

  // Les valeurs validées et formatées
  verifiedValues = {
    price: +price,
    quantity: +quantity,
    fees: +fees,
    tax: +tax,
    comment: cleanComment,
    date: date,
  };

  return { inputErrors, verifiedValues };
}
