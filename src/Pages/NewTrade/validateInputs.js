/**
 * Valide les valeurs fournies et les nettoie si nécessaire.
 * @param {object} values - Les valeurs à valider.
 * @returns - Un objet contenant les erreurs de validation et les valeurs nettoyées.
 */
export function validate(values) {

  const {
    fees,
    portfolioId,
    price,
    quantity,
    stop,
    strategyId,
    target,
    tax,
    position,
    comment,
    date,
    cash,
  } = values;

  const inputErrors = []; // Tableau des erreurs de validation
  let verifiedValues = []; // Tableau des valeurs validées à retourner

  // Vérification que les champs numériques sont bien numériques et non négatifs
  const mustBeNumbers = [
    fees,
    portfolioId,
    price,
    quantity,
    stop,
    strategyId,
    target,
    tax,
  ];

  for (const value of mustBeNumbers) {
    if (
      value === "" || // verifie si non vide
      isNaN(value) || // Vérifie si c'est un nombre
      value < 0 || // Vérifie qu'il n'est pas négatif
      value > 9999999 || // Vérifie qu'il n'a pas plus de 7 chiffres
      value * 1000 - Math.trunc(value * 1000) > 0 // Vérifie qu'il n'a pas plus de 3 décimales
    ) {
      inputErrors.push("Veuillez vérifier les données saisies");
      return { inputErrors, verifiedValues }; // Sortir de la fonction si un élément est invalide
    }
  }

  //  quantité sup à 0 
  if (quantity <= 0)  inputErrors.push(
          "quantité invalide"
        );

  // Vérification de la cohérence des saisies en fonction de la position
  switch (position) {
    case "long":
      if (+target < +price || +stop > +price) {
       inputErrors.push(
         "Incohérence des valeurs saisies avec le sens de trade"
       );
      }
      break;
    case "short":
      if (+target > +price || +stop < +price) {
        inputErrors.push(
          "Incohérence des valeurs saisies avec le sens de trade"
        );
      }
      break;
    default:
      inputErrors.push("Il y a un problème dans le formulaire de saisie.");
      return { inputErrors, verifiedValues }; 
  }

  // Préparation du commentaire en nettoyant les espaces en début et en fin
  const cleanComment = comment.trim();
  // Vérification de la longueur du commentaire
  if (cleanComment.length > 200) {
    inputErrors.push("Commentaire de 200 caractères maximum SVP.");
    return { inputErrors, verifiedValues };  
  }

  // verification de la date 
  if (!(new Date(date) instanceof Date)){
     inputErrors.push("Date invalide");
     return { inputErrors, verifiedValues };   
  }
    // Les valeurs validées et formatées
    verifiedValues = {
      fees: +fees,
      portfolioId: +portfolioId,
      price: +price,
      quantity: +quantity,
      stop: +stop,
      strategyId: +strategyId,
      target: +target,
      tax: +tax,
      position: position,
      comment: cleanComment,
      date: date,
    };

  // Retourne le tableau des erreurs et les valeurs formatées
  return { inputErrors, verifiedValues };
}
