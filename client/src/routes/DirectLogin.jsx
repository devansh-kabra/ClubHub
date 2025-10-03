import { Navigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

function DirectLogin({children}) {

    const queryClient = useQueryClient();
    const userInfo = queryClient.getQueryData(["user"]);
    if (!userInfo) {return children;}
    const userType = userInfo.userType;

    if (!userType) {return children;}
    else {return <Navigate to={`/${userType}/dashboard`} />;}
}

export default DirectLogin;