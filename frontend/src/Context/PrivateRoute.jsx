import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userProvider } from "./UserProvider";

function PrivateRoute({ children }) {
    const [user] = useContext(userProvider);

    // Check if user object has the user_name property
    return user && user.user_name ? children : <Navigate to="/" />;
}

export default PrivateRoute;



