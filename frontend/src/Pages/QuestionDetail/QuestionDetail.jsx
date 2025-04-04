import React, { useContext, useEffect, useState } from "react";
import "./QuestionDetail.css";
import { useParams } from "react-router-dom";
import { QuestionContext } from "../../Context/QuestionContext";
import axios from "../../Components/axios";
import { userProvider } from "../../Context/UserProvider";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material"; // Import CircularProgress

function QuestionDetail() {
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const token = localStorage.getItem("token");
  const [user, setUser] = useContext(userProvider);

  const { questions } = useContext(QuestionContext);
  const { question_id } = useParams();
  const [dbAnswer, setdbAnswer] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    async function getAns() {
      try {
        // Fetch answers for the question
        const ans = await axios.get(`/api/answers/all/${question_id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token for authentication
          },
        });
        setdbAnswer(ans.data.result); // Set answers data
      } catch (error) {
        console.error("Error fetching answers:", error); // Log error
      }
    }

    if (question_id) {
      getAns();
    }
  }, [question_id, token]);

  const selectedQuestion = questions.find(
    (ques) => ques.question_id === question_id
  );

  async function handleClick(data) {
    setLoading(true); // Start loading
    try {
      // Post a new answer
      await axios.post(
        "/api/answers/create",
        {
          answer: data.answer, // Answer text
          question_id: question_id, // Question ID
          user_id: user.user_id, // User ID
        },
        {
          headers: {
            Authorization: "Bearer " + token, // Pass token for authentication
          },
        }
      );

      // Fetch updated answers
      const ans = await axios.get(`/api/answers/all/${question_id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token for authentication
        },
      });
      setdbAnswer(ans.data.result); // Update answers data
      setValue("answer", ""); // Clear the textarea
    } catch (error) {
      console.error("Error posting answer:", error); // Log error
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
    <div className="whole-container">
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">Question</h4>
          <h5 className="card-subtitle mb-2 text-muted">
            {selectedQuestion?.title}
          </h5>
          <p className="card-text">{selectedQuestion?.description}</p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">Answers From The Community</h4>
        </div>
      </div>

      {dbAnswer?.map((answerData, index) => (
        <div className="card mb-3 info_question" key={index}>
          <div className="card-body row">
            <div className="col-md-4 d-flex flex-column align-items-center">
              <i
                className="fas fa-user-circle fa-3x user mb-2"
                style={{ color: "#516cf0 " }}
              />

              <p className="username">{answerData.user_name}</p>
            </div>
            <div className="col-md-8">
              <p className="answer-text">{answerData.answer}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="card answer text-center mb-5">
        <div className="card-body">
          <h2 className="pt-3">Answer The Above Question.</h2>
          <Link to="/home" style={{ textDecoration: "none" }}>
            <small style={{ color: "#ff6b8f ", fontSize: "20px" }}>
              Go to Question Page
            </small>
          </Link>

          <form onSubmit={handleSubmit(handleClick)}>
            <div className="form-group">
              <textarea
                className={`form-control w-75 mx-auto ${
                  errors.answer ? "is-invalid" : ""
                }`}
                rows="6"
                placeholder="Your answer..."
                {...register("answer", {
                  required: "Answer is required",
                  maxLength: {
                    value: 300,
                    message: "Maximum allowed length is 300",
                  },
                })}
                onKeyUp={() => {
                  trigger("answer");
                }}
              />
              {errors.answer && (
                <div className="invalid-feedback">{errors.answer.message}</div>
              )}
              <button
                type="submit"
                className="btn btn-success mt-3 post-button"
              >
                Post Your Answer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;
