// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // লগইন করা না থাকলে লগইন পেজে পাঠিয়ে দাও
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;