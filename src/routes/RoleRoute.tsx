import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../api/authApi";

interface RoleRouteProps {
  allowedRoles: Role[];
}
const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { user } = useAuth();
  //Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //Authenticated but not authorized
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  //Authorized
  return <Outlet />;
};

export default RoleRoute;
