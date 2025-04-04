import React, { useContext, useState } from "react";
import "./SignIn.css";
import { userProvider } from "../../Context/UserProvider";
import axios from "../../Components/axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material"; // Import CircularProgress

function SignIn({ toggleForm }) {
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  const [user, setUser] = useContext(userProvider);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [loading, setLoading] = useState(false); // Add loading state

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  async function logIn(data) {
    setLoading(true); // Start loading
    try {
      // Log in user
      const response = await axios.post("/api/users/login", {
        password: data.password, // Password
        email: data.email, // Email
      });

      localStorage.setItem("token", response.data.token); // Save token

      setUser({
        user_name: response.data.user_name, // Set username
        user_id: response.data.user_id, // Set user ID
      });

      navigate("/home", { replace: true }); // Redirect to home page
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Invalid credentials. Please check your email and password."); // Show error alert
      } else {
        console.error("Something went wrong:", error.message); // Log error
      }
    } finally {
      setLoading(false); // Stop loading
    }
  }

  if (loading) {
    return (
      <div className="spinner-container">
        <CircularProgress /> {/* Show spinner while loading */}
      </div>
    );
  }

  return (
    <div className="login__container col-md">
      <h4>Login to your account </h4>
      <p>
        Don’t have an account?
        <Link className="create" onClick={toggleForm}>
          Create a new account
        </Link>
      </p>
      <form onSubmit={handleSubmit(logIn)}>
        <input
          type="text"
          className={errors.email && "invalid"}
          placeholder="  Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          onKeyUp={() => {
            trigger("email");
          }}
          style={{ padding: "5px" }}
        />

        <div className="password-container">
          <input
            type={passwordVisible ? "password" : "text"}
            className={` hide ${errors.password && "invalid"}`}
            placeholder="  Password"
            {...register("password", {
              required: "Password is required",

              minLength: {
                value: 8,
                message: "Minimum password length is 8",
              },
            })}
            onKeyUp={() => {
              trigger("password");
            }}
            style={{ padding: "5px" }}
          />
          <div className="signinfas">
            <i onClick={togglePasswordVisibility}>
              {passwordVisible ? (
                <i className="fas fa-eye-slash" />
              ) : (
                <i className="fas fa-eye" />
              )}
            </i>
          </div>
        </div>
        <button className="login__signInButton " type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignIn;
