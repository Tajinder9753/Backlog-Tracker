import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../Hooks/useUser";

function ProtectedRoutes() {
   const {user, loadingUser} = useUser();

   if (loadingUser) {
    return <div>Loading...</div>
   }

    if (!user) {
        return <Navigate to = "/login" />
    }

    return <Outlet />
}

export default ProtectedRoutes;