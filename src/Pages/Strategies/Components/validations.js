export function validateCreation (values, strategies){
  const { title, comment } = values;
  const inputErrors = []; // Tableau des erreurs de validation
  let verifiedValues = []; // Tableau des valeurs validées à retourner

  const cleanTitle = title.trim();
  // Vérification de la longueur 
  if (cleanTitle.length > 50) {
    inputErrors.push("Dénomination de 50 caractères maximum SVP.");
    return { inputErrors };
  }

    if (cleanTitle.length < 3) {
      inputErrors.push("Dénomination de 3 caractères minimum SVP.");
      return { inputErrors };
    }

  // verification que le nom de la stratégie n'existe pas pour cet utilisateur
  if (
    strategies.find(
      (elet) => elet.title.toLowerCase() === cleanTitle.toLowerCase()
    ) !== undefined
  ) {
    inputErrors.push("Vous avez déja une strategie de ce nom.");
    return { inputErrors };
  }

  const cleanComment = comment.trim();
  // Vérification de la longueur du commentaire
  if (cleanTitle.length > 200) {
    inputErrors.push("Commentaire de 200 caractères maximum SVP.");
    return { inputErrors };
  }

  // Les valeurs validées et formatées
  verifiedValues = {
    comment: cleanComment,
    title: cleanTitle,
  };

  // Retourne le tableau des erreurs et les valeurs formatées
  return { inputErrors, verifiedValues };
}