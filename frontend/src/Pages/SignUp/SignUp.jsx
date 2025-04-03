import React, { useState } from "react";
import "./SignUp.css";
import axios from "../../Components/axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function SignUp({ toggleForm }) {
  const [errorResponse, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function onSubmit(data) {
    console.log(data);
    reset();

    try {
      await axios.post("/api/users/register", {
        user_name: data.user_name,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        email: data.email,
      });

      toggleForm();
    } catch (error) {
      console.log(error);
      setError(error.response.data.msg);
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login__container container col-sm-12 col-md">
      <h4>Join the network </h4>
      <p>
        Already have an account?
        <Link className="create" onClick={toggleForm}>
          Sign in
        </Link>
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          onKeyUp={() => trigger("email")}
          style={{ padding: "4px", paddingLeft: "5px" }}
        />
        {errors.email && (
          <div>
            <small className="text-danger">{errors.email.message}</small>
          </div>
        )}

        <div className="input-group">
          <input
            className={`first-name ${errors.first_name && "invalid"}`}
            type="text"
            placeholder="  First Name"
            {...register("first_name", {
              required: "First name is required",
            })}
            onKeyUp={() => trigger("first_name")}
            style={{ padding: "4px" }}
          />
          <input
            className={`last-name ${errors.last_name && "invalid"}`}
            type="text"
            placeholder="  Last Name"
            {...register("last_name", {
              required: "Last name is required",
            })}
            onKeyUp={() => trigger("last_name")}
            style={{ padding: "4px" }}
          />
        </div>

        <input
          type="text"
          className={errors.user_name && "invalid"}
          placeholder="  User Name"
          {...register("user_name", {
            required: "Username is required",
          })}
          onKeyUp={() => trigger("user_name")}
          style={{ padding: "4px" }}
        />
        {errors.user_name && (
          <div>
            <small className="text-danger">{errors.user_name.message}</small>
          </div>
        )}
        {errorResponse && (
          <div>
            <small className="text-danger">{errorResponse}</small>
          </div>
        )}

        <input
          type={passwordVisible ? "password" : "text"}
          className={`hide ${errors.password && "invalid"}`}
          placeholder="  Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Minimum password length is 8",
            },
          })}
          onKeyUp={() => trigger("password")}
          style={{ padding: "4px" }}
        />
        <div className="signfas">
          <i onClick={togglePasswordVisibility}>
            {passwordVisible ? (
              <i className="fas fa-eye-slash" />
            ) : (
              <i className="fas fa-eye" />
            )}
          </i>

          {errors.password && (
            <div>
              <small className="text-danger">{errors.password.message}</small>
            </div>
          )}
        </div>
        <p>
          I agree to the{" "}
          <Link
            className="create"
            to="https://www.evangadi.com/legal/privacy/"
            target="_blank"
          >
            privacy policy
          </Link>
          {"  "}
          and{"  "}
          <Link
            className="create"
            to="https://www.evangadi.com/legal/terms/"
            target="_blank"
          >
            terms of service.
          </Link>
        </p>
        <button className="login__signInButton" type="submit">
          Agree and Join
        </button>
      </form>
    </div>
  );
}

export default SignUp;
