
import React, { createContext, useState, useEffect } from "react";

export const userProvider = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ user_name: "", user_id: "" });

  useEffect(() => {
    // Load user data from local storage (or wherever you store it)
    const storedUser = localStorage.getItem("user"); // Assuming you store as "user"

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser); // Parse JSON string
        setUser(parsedUser); // Set the user state with stored data
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
        // Handle the error (e.g., clear local storage to avoid infinite loop)
        localStorage.removeItem("user");
      }
    }
  }, []); // Run only once on mount

  return (
    <userProvider.Provider value={[user, setUser]}>
      {children}
    </userProvider.Provider>
  );
};

