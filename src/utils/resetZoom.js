// Function to reset the zoom
export function resetZoom() {
  console.log("reset zoom called");

  document.body.style.zoom = "100%";
  const viewportmeta = document.querySelector("meta[name=viewport]");
  viewportmeta.setAttribute("content", "width=device-width, initial-scale=1");







}



 