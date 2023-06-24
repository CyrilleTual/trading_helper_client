 import { Link } from "react-router-dom";

function BtnLink({link, title}) {
  return (
    <Link to={link}>
      {title}
    </Link>
  )
}

export default BtnLink