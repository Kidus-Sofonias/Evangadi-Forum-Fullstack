
import React from "react";
import "./HowItWorks.css";
import { FaUserPlus, FaSignInAlt, FaQuestion, FaReply, FaEye } from "react-icons/fa"; 

function HowItWorks() {
  return (
    <div className="how-it-works"> 
      <h2>How it Works</h2>
      <div className="how-it-works-content"> 
        <div className="how-it-works-step">
          <FaUserPlus className="step-icon" /> 
          <h3>1. Register</h3>
          <p>
            Create an account by providing your first and last name, username, email address, and password. Ensure your username and email are unique.
          </p>
        </div>

        <div className="how-it-works-step">
          <FaSignInAlt className="step-icon"/>
          <h3>2. Sign In</h3>
          <p>
            Already a member? Log in using your email and password to access your account.
          </p>
        </div>

        <div className="how-it-works-step">
          <FaQuestion className="step-icon" />
          <h3>3. Post Questions</h3>
          <p>
            After logging in, navigate to the Questions Page to post your programming-related inquiries. Make sure to include a clear title and a detailed explanation to get the best help.
          </p>
        </div>

        <div className="how-it-works-step">
          <FaReply className="step-icon" />
          <h3>4. Provide Answers</h3>
          <p>
            Browse through questions posted by other users and share your expertise by answering them. Your username will be displayed with each answer.
          </p>
        </div>

        <div className="how-it-works-step">
          <FaEye className="step-icon" />
          <h3>5. Explore and Evaluate</h3>
          <p>
            Discover and review various questions and answers to gain knowledge and assist others. Engaging with the community helps everyone learn and grow.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;