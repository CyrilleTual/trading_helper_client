 import { useRef } from "react";
import "./burger.css"
 


function Burger() {
  const burgerEl = useRef(null);
  /** Script de toogle class pour le bouton burger
   * Pas de toggle de class sur isClosed / isOpen car pas de class initialement
   * (le set d'une classe délanche une animation)
   */



  let isClosed, trigger, totoggle;
  if (burgerEl.current !== null) {
    isClosed = true;
    trigger = burgerEl.current;
    totoggle = document.querySelector(".nav-menu");
    trigger.addEventListener("click", burgerTime);
  function burgerTime() {
    if (isClosed == true) {
      trigger.classList.remove("is-closed");
      trigger.classList.add("is-open");
    } else {
      trigger.classList.remove("is-open");
      trigger.classList.add("is-closed");
    }
    isClosed = !isClosed;
    totoggle.classList.toggle("displayNone");
  }

  }

  return (
    <div ref={burgerEl} class="hamburglar icon ">
      <div class="burger-icon">
        <div class="burger-container">
          {/* <!-- les 3span représentent les 3 traits --> */}
          <span class="burger-bun-top"></span>
          <span class="burger-filling"></span>
          <span class="burger-bun-bot"></span>
        </div>
      </div>
      {/* <!-- cercle svg autour des 3 traits horizontaux  --> */}
      <div class="burger-ring">
        <svg class="svg-ring">
          <path
            class="path"
            fill="none"
            stroke="#191919"
            stroke-miterlimit="10"
            stroke-width="4"
            d="M 34 2 C 16.3 2 2 16.3 2 34 s 14.3 32 32 32 s 32 -14.3 32 -32 S 51.7 2 34 2"
          />
          {/* <!-- M-> Move , C, S -> Curve Etc... --> */}
        </svg>
      </div>
      {/* <!-- ce path "mask" permet l'animation du cercle  --> */}
      <svg class="svgZero">
        <mask id="mask">
          <path
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="#ff0000"
            stroke-miterlimit="10"
            stroke-width="4"
            d="M 34 2 c 11.6 0 21.8 6.2 27.4 15.5 c 2.9 4.8 5 16.5 -9.4 16.5 h -4"
          />
        </mask>
      </svg>
      <div class="path-burger">
        <div class="animate-path">
          <div class="path-rotation"></div>
        </div>
      </div>
    </div>
  );
}

export default Burger;
