import React, { useContext, useEffect, useState } from 'react';
import "./QuestionDetail.css";
import { useParams } from 'react-router-dom';
import { QuestionContext } from '../../Context/QuestionContext';
import axios from "../../Components/axios";
import { userProvider } from '../../Context/UserProvider';
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom"

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
  
  useEffect(() => {
    async function getAns() {
      try {
        const ans = await axios.get(
          `/answers/all/${question_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(ans.data)
        setdbAnswer(ans.data.result);
      } catch (error) {
        console.log(error);
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
    try {
      await axios.post(
        "/answers/create",  
        {
          answer: data.answer,
          question_id: question_id,
          user_id: user.user_id,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const ans = await axios.get(
        `/answers/all/${question_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(ans.data) 

      // Update the dbAnswer state with the fetched answers
      setdbAnswer(ans.data.result);
      setValue("answer", ""); // Clear the textarea after posting
    } catch (error) {
      console.log(error);
    }
  }
  console.log(selectedQuestion) 
  return (
    <div className="whole-container">
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">Question</h4>
          <h5 className="card-subtitle mb-2 text-muted">{selectedQuestion?.title}</h5>
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
            <i className="fas fa-user-circle fa-3x user mb-2" style={{ color: "#516cf0 " }} />

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
          <Link to="/home" style={{textDecoration: "none"}}>
                <small style={{ color: '#ff6b8f ', fontSize: '20px',  }}>
                  Go to Question Page
                </small>
                </Link>

          <form onSubmit={handleSubmit(handleClick)}>
            <div className="form-group">
              <textarea
                className={`form-control w-75 mx-auto ${errors.answer ? "is-invalid" : ""}`}
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
                <div className="invalid-feedback">
                  {errors.answer.message}
                </div>
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