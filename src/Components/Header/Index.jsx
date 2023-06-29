 
import { useSelector } from "react-redux";
import Nav from "./Nav";
import NavPorfolios from "./NavPortfolios";
 

function Header() {

  const islogged = useSelector((state)=> state.user.isLogged)
  
  return (
    <>
      {islogged &&
        <header>
          <nav>
            <Nav />
            <NavPorfolios />
          </nav>
        </header>
      }
    </>
  );
}

export default Header