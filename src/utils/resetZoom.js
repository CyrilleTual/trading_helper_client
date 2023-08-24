// Function to reset the zoom
export function resetZoom() {
  //console.log("reset zoom called");

  document.body.style.zoom = "100%";

  // console.log(document.documentElement.style.zoom);

  // console.log (document.body.getBoundingClientRect())

  // var viewportWidth = window.innerWidth ;
  // var screenWidth = window.screen.width;

  // var viewportScale = viewportWidth/ screenWidth  ;

  // console.log(viewportWidth, screenWidth, viewportScale);


  const viewportmeta = document.querySelector("meta[name=viewport]");

  viewportmeta.content = "width=device-width, initial-scale=1";







}



 