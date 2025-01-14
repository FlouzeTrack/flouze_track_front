import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user } = useAuth();

  // Show loading state while checking authentication
  if (user === null) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (user === false) {
    return <Navigate to="/login" />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
