import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../store/slice/user.js";
import { resetStorage } from "../utils/tools.js";

function Logged({ child }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const Child = child; // pour reconnaissance comme composant réact modification casse

  const islogged = useSelector((state) => state.user.isLogged);
  const role = useSelector((state) => state.user.infos.role);

  useEffect(() => {
    if (islogged && role && (role === "admin" || role === "user")) {
      setIsAuthorized(true);
    } else if (islogged && role && role !== "admin" && role !== "user") {
      resetStorage();
      dispatch(signOut());
      navigate("/");
    } else {
      navigate("/");
    }
  }, [role]);
  if (isAuthorized) return <Child />;
}

export default Logged;