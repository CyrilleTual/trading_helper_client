import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../store/slice/user.js";
import { resetStorage } from "../utils/tools.js";
import { resetZoom } from "../utils/resetZoom.js";
import Modal from "../Components/Modal/Index";
 
function Logged({ child }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCandicate, setIsCandidate] = useState(false);
  const Child = child; // pour reconnaissance comme composant réact modification casse

  const islogged = useSelector((state) => state.user.isLogged);
  const role = useSelector((state) => state.user.infos.role);

  const afterModal = () => {
    resetStorage();
    dispatch(signOut());
    navigate("/");
  };
  
  // eslint-disable-next-line
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
      role.substring(0, 7) !== "visitor"
    ) {
      resetStorage();
      dispatch(signOut());
      navigate("/");
    } else {
      navigate("/");
    }
    // eslint-disable-next-line
  });

  if (isCandicate)
    return (
      <Modal
        display={
          <p>
            Votre compte est en attente de validation. <br />
            Merci de bien vouloir patienter, nos équipes vont étudier votre
            demande d'accès.
          </p>
        }
        action={afterModal}
      />
    );

  if (isAuthorized) return <Child />;
}

export default Logged;
