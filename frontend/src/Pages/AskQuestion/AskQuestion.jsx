import React, { useContext, useState } from "react";
import { userProvider } from "../../Context/UserProvider";
import { v4 as uuidv4 } from "uuid";
import axios from "../../Components/axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "./AskQuestion.css";

function InstructionList() {
  return (
    <div className="instruction-section py-4">
      <h2 className="instruction-title">Steps To Write A Good Question.</h2>
      <ul className="instruction-list mx-auto">
        <li>
          <span className="bullet">●</span> Summarize your problem in a one-line
          title.
        </li>
        <li>
          <span className="bullet">●</span> Describe your problem in more
          detail.
        </li>
        <li>
          <span className="bullet">●</span> Describe what you tried and what you
          expected to happen.
        </li>
        <li>
          <span className="bullet">●</span> Review your question and post it
          here.
        </li>
      </ul>
    </div>
  );
}

function AskForm({ onSubmit, register, trigger, errors }) {
  return (
    <form onSubmit={onSubmit} className="question-form">``
      <textarea
        placeholder="Tag"
        className={`input-box ${errors.tag ? "invalid" : ""}`}
        rows="2"
        {...register("tag", {
          required: "Tag is required.",
          minLength: { value: 3, message: "Minimum tag length is 3" },
        })}
        onKeyUp={() => trigger("tag")}
      />
      {errors.tag && (
        <small className="text-danger">{errors.tag.message}</small>
      )}

      <textarea
        placeholder="Question title ..."
        className={`input-box ${errors.title ? "invalid" : ""}`}
        rows="2"
        {...register("title", {
          required: "Title is required",
          maxLength: { value: 200, message: "Maximum length is 200" },
        })}
        onKeyUp={() => trigger("title")}
      />
      {errors.title && (
        <small className="text-danger">{errors.title.message}</small>
      )}

      <textarea
        placeholder="Question detail ..."
        className={`input-box ${errors.question ? "invalid" : ""}`}
        rows="6"
        {...register("question_description", {
          required: "Question is required",
          maxLength: { value: 300, message: "Maximum allowed length is 300" },
        })}
        onKeyUp={() => trigger("question")}
      />
      {errors.question && (
        <small className="text-danger">{errors.question.message}</small>
      )}

      <button type="submit" className="post-button">
        Post Question
      </button>
    </form>
  );
}

function AskQuestion() {
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [user] = useContext(userProvider);
  const token = localStorage.getItem("token");
  const [successful, setSuccessful] = useState(false);

  async function handlePost(data) {
    const question_id = uuidv4();
    try {
      await axios.post(
        "/create-question",
        {
          tag: data.tag,
          title: data.title,
          question_description: data.question_description,
          question_id,
          user_id: user.user_id,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setSuccessful(true);
      reset();
    } catch (error) {
      console.error("Error posting question:", error.response || error);
    }
  }

  return (
    <div className="container text-center ask-question-container">
      <InstructionList />
      <div>
        <h2 className="form-title pb-2">Post Your Question</h2>
        {successful && (
          <div>
            <Link to="/home" style={{ textDecoration: "none" }}>
              <small className="success-message">
                Question posted successfully. Redirecting to home page...
              </small>
            </Link>
          </div>
        )}
        <AskForm
          onSubmit={handleSubmit(handlePost)}
          register={register}
          trigger={trigger}
          errors={errors}
        />
      </div>
    </div>
  );
}

export default AskQuestion;
