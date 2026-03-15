import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/UserContext/UserContext";
import LoadingState from "../../@All/LoadingScreens/MainLoading";

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Use context if possible for better sync
  
  // 1. Get tokens from storage
  // Check both cases if you aren't sure of the exact string key
  const token = localStorage.getItem("AdminToken") || localStorage.getItem("adminToken");
  const role = localStorage.getItem("adminRole");

  if (loading) return <LoadingState />;

  // 2. Check logic
  // If no token exists OR the role isn't admin, kick them out
  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;