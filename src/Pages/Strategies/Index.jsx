import { useNavigate } from "react-router-dom";
import Modal from "../../Components/Modal/Index";

function Strategies() {

  const navigate = useNavigate();

  const goOn = () => {
    navigate("/");
  }

  return (
    <Modal
      display={
        <p>
         Les fonctionnalités liées aux statégies sont en cours de développement<br />
          Pour créer des libéllés personalisés, envoyez-nous un mail 
        </p>
      }
      action={goOn}
    />
  );
}

export default Strategies