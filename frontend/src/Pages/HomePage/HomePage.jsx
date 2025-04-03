import React, { useContext, useEffect, useState } from "react";
import "./HomePage.css";
import Question from "../Question/Question";
import { userProvider } from "../../Context/UserProvider";
import { useNavigate } from "react-router-dom";
import axios from "../../Components/axios";
import { QuestionContext } from "../../Context/QuestionContext";
import "bootstrap/dist/css/bootstrap.min.css";

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useContext(userProvider);
  const { questions, setQuestions } = useContext(QuestionContext) || {
    questions: [],
    setQuestions: () => {},
  };
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 4;
  const [totalQuestions, setTotalQuestions] = useState(0); // Add state for total questions
  const [searchTag, setSearchTag] = useState(""); // Add state for search input

  function handleClick() {
    navigate("/ask");
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  async function handleDelete(questionId) {
    try {
      await axios.delete(`/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.question_id !== questionId)
      );
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  }

  function handleEdit(questionId) {
    navigate(`/edit-question/${questionId}`);
  }

  const fetchQuestionsByTag = async (tag) => {
    try {
      // Fetch questions filtered by tag
      const response = await axios.get(
        `/api/questions/search?tag=${encodeURIComponent(tag)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token for authentication
          },
        }
      );
      setQuestions(response.data.result); // Update questions with filtered results
    } catch (err) {
      console.error("Error fetching questions by tag:", err); // Log error
    }
  };

  function handleSearch() {
    if (!searchTag.trim()) {
      console.warn("Search tag is empty — skipping request.");
      return;
    }
    fetchQuestionsByTag(searchTag);
  }

  useEffect(() => {
    async function fetchAllQuestions() {
      try {
        // Fetch paginated questions
        const response = await axios.get(
          `/api/questions/all-questions?page=${currentPage}&limit=${questionsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token for authentication
            },
          }
        );
        setQuestions(response.data.result); // Set questions data
        setTotalQuestions(response.data.total); // Update total questions count
        setLoading(false); // Stop loading spinner
      } catch (error) {
        console.error("Error fetching questions:", error); // Log error
        setLoading(false); // Stop loading spinner
      }
    }
    fetchAllQuestions();
  }, [token, setQuestions, currentPage]); // Ensure currentPage is a dependency

  return (
    <div className="container">
      <div className="homp">
        <div className="row hed mb-5">
          <div className="col-md-6 d-flex justify-content-center justify-content-md-start">
            <button onClick={handleClick} className="qb">
              Ask Question
            </button>
          </div>
          <div className="col-md-6 d-flex justify-content-center justify-content-md-end">
            <h4 className="wel">Welcome : {user.user_name}</h4>
          </div>
        </div>
        <div className="search-bar mb-4">
          <input
            type="text"
            placeholder="Search by tag..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="form-control"
          />
          <button
            onClick={handleSearch}
            className="btn btn-primary mt-2"
            disabled={!searchTag.trim()} // disable when input is empty
          >
            Search
          </button>
        </div>
        <h3 className="ns">Questions</h3>
      </div>
      <div className="load">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          questions?.map((question) => (
            <div className="question-item" key={question.question_id}>
              <Question
                title={question.title}
                user_name={
                  `${question.first_name} ${question.last_name}`.trim() ||
                  question.user_name
                }
                question_id={question.question_id}
                tag={question.tag}
              />
            </div>
          ))
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * questionsPerPage >= totalQuestions} // Disable if no more pages
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HomePage;
