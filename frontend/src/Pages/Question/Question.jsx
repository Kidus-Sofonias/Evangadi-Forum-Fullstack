import React, { useEffect, useState } from "react";
import "./Question.css";
import { useNavigate } from "react-router-dom";

function Question({ title, user_name, question_id }) {
  const navigate = useNavigate();
	function handleClick() {
		navigate(`/questions/${question_id}`);  
	}

  return (
    <div className="border-top row top_question " onClick={handleClick}>
      <div className="col-md-3 d-flex flex-column align-items-md-center my-md-auto">
        <i
          className="fas fa-user-circle fa-3x user"
          style={{ color: "#516cf0 " }}
        />
        <p className="mb-0">{user_name}</p>
      </div>
      <div className="col-md-8  my-md-auto ">
        <p className=" ">{title}</p>
      </div>
      <div className=" col-md text-md-end   my-md-auto">
        <i className="fas fa-angle-right fa-lg    " />
      </div>
    </div>
  );
}

export default Question;
