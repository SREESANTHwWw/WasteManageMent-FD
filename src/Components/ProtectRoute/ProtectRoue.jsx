import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/UserContext/UserContext";
import LoadingState from "../../@All/LoadingScreens/MainLoading";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading ,} = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  // guest or no user
  if (!user || user?.isGuest || !user?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // role check
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.role?.toLowerCase())
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;