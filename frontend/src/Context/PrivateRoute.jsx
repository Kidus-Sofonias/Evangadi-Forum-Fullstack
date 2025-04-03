import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userProvider } from "./UserProvider";

function PrivateRoute({ children }) {
  const [user] = useContext(userProvider);
  const token = localStorage.getItem("token");

  // Valid if user and token exist
  const isAuthenticated = token && user && user.user_name;

  return isAuthenticated ? children : <Navigate to="/" />;
}

export default PrivateRoute;
