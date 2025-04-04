import React, { useContext, useEffect, useState } from "react";
import "./UserAccessPage.css";
import SignIn from "../SignIn/SignIn";
import { Link } from "react-router-dom";
import SignUp from "../SignUp/SignUp";
import { userProvider } from "../../Context/UserProvider";
import { CircularProgress } from "@mui/material"; // Import CircularProgress

function UserAccessPage() {
  const [user, setUser] = useContext(userProvider);
  const [showSignIn, setSignIn] = useState(true);
  const [loading, setLoading] = useState(false); // Add loading state

  function toggleForm() {
    setSignIn((prevState) => !prevState);
  }

  useEffect(() => {
    if (user.user_name) {
      setLoading(true); // Start loading
      setTimeout(() => {
        setUser({});
        localStorage.setItem("token", "");
        console.log("deleted user");
        setLoading(false); // Stop loading
      }, 1000); // Simulate a delay
    }
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <CircularProgress /> {/* Show spinner while loading */}
      </div>
    );
  }

  return (
    <div className="home">
      <div className="container">
        <div className="con row">
          {showSignIn ? (
            <SignIn key="signIn" toggleForm={toggleForm} />
          ) : (
            <SignUp key="signUp" toggleForm={toggleForm} />
          )}

          <div className="info col col-md pb-sm-5">
            <Link to="" className="about" target="_blank">
              About
            </Link>
            <h1 className="network pb-3 hi">Evangadi Networks</h1>
            <p>
              No matter what stage of life you are in, whether you’re just
              starting elementary school or being promoted to CEO of a Fortune
              500 company, you have much to offer to those who are trying to
              follow in your footsteps.
            </p>

            <p className="pl">
              Wheather you are willing to share your knowledge or you are just
              looking to meet mentors of your own, please start by joining the
              network here.
            </p>

            <Link to="/how-it-works">
              <button className="works">HOW IT WORKS</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAccessPage;
