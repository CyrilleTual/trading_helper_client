

export function resetStorage() {
  // on efface le localStorage
  localStorage.removeItem("auth42titi@");
  localStorage.removeItem("remember");
}


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

export function datetimeToFrShort(dateTime) {
  // Assuming trade.firstEnter is a valid date string or timestamp
  const tradeDate = new Date(dateTime);

  // Extract the day, month, and year components
  const day = tradeDate.getDate();
 const month =
  ( tradeDate.getMonth() + 1) < 10
     ? "0" + (tradeDate.getMonth() + 1)
     : (tradeDate.getMonth() + 1);
  

  //const year = tradeDate.getFullYear() % 100; // Get the last two digits of the year
  const year = tradeDate.getFullYear(); // Get the last two digits of the year

  // Format the date as "jj mmmm aa"
  return `${day} / ${month} / ${year}`;
}



