import { useNavigate } from "react-router-dom";
import Modal from "../../Components/Modal/Index";

function OnProcessStrategies() {

  const navigate = useNavigate();

  const goOn = () => {
    navigate("/strategies");
  };

  return (
    <Modal
      display={
        <p>
          Les fonctionnalités complémentaires liées aux statégies sont en cours de développement
          
        </p>
      }
      action={goOn}
    />
  );
}

export default OnProcessStrategies;
