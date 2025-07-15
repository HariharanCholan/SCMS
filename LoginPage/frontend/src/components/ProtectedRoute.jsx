import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // While loading session from backend, wait
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>; // Or a spinner
  }

  // No logged-in user
  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If the user's role is not allowed
  if (!allowedRoles.includes(currentUser.userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // All good
  return children;
};

export default ProtectedRoute;
