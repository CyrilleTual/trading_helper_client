import { NavLink } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <h1>Oops! You seems to be lost.</h1>
      <NavLink to="/">Acceuil</NavLink>
    </div>
  );
}

export default NotFound;
