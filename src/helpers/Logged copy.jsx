import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch} from "react-redux";
import { resetStorage } from "../utils/tools.js"
import { signOut } from "../store/slice/user.js"

function Logged({child}) {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const islogged = useSelector((state) => state.user.isLogged);
    const role =  useSelector((state) => state.user.infos.role)
    const [isAuthorized, setIsAuthorized] = useState(false);
    const Child = child  // pour reconnaissance comme composant réact

    useEffect(()=>{
        if (islogged && (role === "admin" || role ==="user")) {
            setIsAuthorized(true);
        } else {
            resetStorage();
            dispatch (signOut());
            navigate("/")
        }
    })
    if (isAuthorized) return <Child />;

}

export default Logged