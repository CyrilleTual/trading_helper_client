import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Logged({child}) {

    const navigate = useNavigate();
    const islogged = useSelector((state) => state.user.isLogged);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const Child = child  // pour reconnaissance comme composant réact

    useEffect(()=>{
        if (islogged) {
            setIsAuthorized(true);
        } else {
            navigate("/")
        }
    })
    if (isAuthorized) return <Child />;

}

export default Logged