import { Navigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

export function ProtectedRoute({allow, children}) {
    
    const queryClient = useQueryClient();
    const userInfo = queryClient.getQueryData(["user"]);

    const userType = userInfo?.userType;

    if (!userType) {return <Navigate to={"/"} />;} 
    else if (allow && allow === userType) {return children;}
    else {return <Navigate to={"/"} />;}
}

export function ProtectRouteAll({children}) {
    const queryClient = useQueryClient();
    const userInfo = queryClient.getQueryData(["user"]);
    const userType = userInfo.userType;

    if (!userType) {return <Navigate to={"/"} />;}
    else {return children;}
}
