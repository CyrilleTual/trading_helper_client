/**
 * Valide les valeurs fournies et les nettoie si nécessaire.
 * @param {object} values - Les valeurs à valider.
 * @returns - Un objet contenant les erreurs de validation et les valeurs nettoyées.
 */
export function validate(values, position) {
  const inputErrors = []; // Tableau des erreurs de validation
  let verifiedValues = []; // Tableau des valeurs validées à retourner

  const {price,stop, target, comment, date} = values;

  // Vérification que les champs numériques sont bien numériques et non négatifs
  const mustBeNumbers = [ price, stop, target ];

  for (const value of mustBeNumbers) {
    if (
      isNaN(value) || // Vérifie si c'est un nombre
      value < 0 || // Vérifie qu'il n'est pas négatif
      value > 9999999 || // Vérifie qu'il n'a pas plus de 7 chiffres
      value * 1000 - Math.trunc(value * 1000) > 0 // Vérifie qu'il n'a pas plus de 3 décimales
    ) {
      inputErrors.push("Veuillez vérifier les données saisies");
      return { inputErrors, verifiedValues }; // Sortir de la fonction si un élément est invalide
    }
  }

  // Vérification de la cohérence des saisies en fonction de la position -  price = prix actuel
  switch (position) {
    case "long":
      if (+target < +price || +stop > +price) {
        inputErrors.push(
          "Incohérence des valeurs saisies "
        );
      }
      break;
    case "short":
      if (+target > +price || +stop < +price) {
        inputErrors.push(
          "Incohérence des valeurs saisies "
        );
      }
      break;
    default:
      inputErrors.push("Il y a un problème dans le formulaire de saisie.");
      return { inputErrors, verifiedValues }; // Sortir de la fonction si position invalide
  }

  // vérification du format de la date ////////////////////////////
  if (isNaN(new Date(date).getTime())) {
    inputErrors.push("Date non valide");
    return { inputErrors, verifiedValues }; // Sortir de la fonction si position invalide
  }

  // Préparation du commentaire en nettoyant les espaces en début et en fin
  const cleanComment = comment.trim();
  // Vérification de la longueur du commentaire
  if (cleanComment.length > 200) {
    inputErrors.push("Commentaire de 200 caractères maximum SVP.");
    return { inputErrors, verifiedValues }; // Sortir de la fonction si position invalide
  }

  // Les valeurs validées et formatées
  verifiedValues = {
    stop: +stop,
    target: +target,
    comment: cleanComment,
    date: date
  };

  // Retourne le tableau des erreurs et les valeurs formatées
  return { inputErrors, verifiedValues };
}
