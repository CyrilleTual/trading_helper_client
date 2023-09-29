

export function resetStorage() {
  // on efface le localStorage
  localStorage.removeItem("auth42titi@");
  localStorage.removeItem("remember");
}

/**
 * Transforme un format datetime en un format fr long 
 * @param {*} dateTime 
 * @returns 
 */
export function datetimeToFrLong (dateTime){
  // Assuming trade.firstEnter is a valid date string or timestamp
  const tradeDate = new Date(dateTime);

  // Create an array of month names in French
  const monthNames = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  // Extract the day, month, and year components
  const day = tradeDate.getDate();
  const month = monthNames[tradeDate.getMonth()];
  //const year = tradeDate.getFullYear() % 100; // Get the last two digits of the year
  const year = tradeDate.getFullYear() ; // Get the last two digits of the year

  // Format the date as "jj mmmm aa"
  return `${day} ${month} ${year}`;
}

/**
 * Transforme un format datetime en un format fr court
 * @param {*} dateTime 
 * @returns 
 */ 
export function datetimeToFrShort(dateTime) {
  // Assuming trade.firstEnter is a valid date string or timestamp
  const tradeDate = new Date(dateTime);

  // Extract the day, month, and year components
  const day = tradeDate.getDate();
 const month =
  ( tradeDate.getMonth() + 1) < 10
     ? "0" + (tradeDate.getMonth() + 1)
     : (tradeDate.getMonth() + 1);
  

  const year = tradeDate.getFullYear() % 100; // Get the last two digits of the year
  //const year = tradeDate.getFullYear(); // Get the last two digits of the year

  // Format the date as "jj mmmm aa"
  return `${day}/${month}/${year}`;
}

 


/**
 * Cette fonction trie un tableau d'éléments en fonction des critères spécifiés.
 * 
 * @param {Array} items - Le tableau d'éléments à trier.
 * @param {Array} critereArray - Le tableau de critères de tri.
 * @returns {Array} - Le tableau trié.
 */
export function sort(items, critereArray) {
  let copy = [...items]; // Crée une copie du tableau sinon erreur -> immutable
  return copy.sort(function compare(a, b) {
    const criteres = critereArray;
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
