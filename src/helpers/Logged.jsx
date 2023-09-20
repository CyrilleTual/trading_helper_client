import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../store/slice/user.js";
import { resetStorage } from "../utils/tools.js";
import { resetZoom } from "../utils/resetZoom.js";
import Modal from "../Components/Modal/Index.jsx";

function Logged({ child }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCandidate, setIsCandidate] = useState(false);

  const Child = child; // pour reconnaissance comme composant réact modification casse

  const islogged = useSelector((state) => state.user.isLogged);
  const role = useSelector((state) => state.user.infos.role);

  // après  modal
  const afterModal = () => {
    resetStorage();
    dispatch(signOut());
    navigate("/");
  };

  useEffect(() => {
    resetZoom();

    if (islogged && role === "candidate") {
      setIsCandidate(true);
    } else if (
      islogged &&
      role &&
      (role === "admin" ||
        role === "user" ||
        role.substring(0, 7) === "visitor")
    ) {
      setIsAuthorized(true);
    } else if (
      (islogged && role && role !== "admin" && role !== "user") ||
      role.substring(0, 7) === "visitor"
    ) {
      resetStorage();
      dispatch(signOut());
      navigate("/");
    } else {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [isLogged, role, navigate, dispatch]);

  if (isAuthorized) return <Child />;

  if (isCandidate) return <Modal display={<p>Nous avons bien enregistré votre demande d'accès. <br/>Votre demande est en cours de validation.</p>} action={afterModal} />;


}

export default Logged;
