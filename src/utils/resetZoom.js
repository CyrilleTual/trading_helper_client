export function resetZoom () {

    console.log ("reset zoom called")

document.documentElement.style.zoom = "1";
//   var scale = "scale(1)";
//   document.body.style.webkitTransform = scale; // Chrome, Opera, Safari
//   document.body.style.msTransform = scale; // IE 9
//   document.body.style.transform = scale; // General

  document.body.style.zoom = "100%";



}
  
  
