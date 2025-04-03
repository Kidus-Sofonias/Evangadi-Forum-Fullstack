import Header from "./Components/Header/Header";
import Landing from "./Pages/Landing/Landing.jsx";
import Footer from "./Components/Footer/Footer";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import QuestionDetail from "./Pages/QuestionDetail/QuestionDetail.jsx";
import AskQuestion from "./Pages/AskQuestion/AskQuestion";
import SignUp from "./Pages/SignUp/SignUp";
import { UserProvider, userProvider } from "./Context/UserProvider";
import axios from "./Components/axios";
import { useContext, useEffect } from "react";
import { QuestionContext } from "./Context/QuestionContext";
import HowItWorks from "./Pages/HowItWorks/HowItWorks";
import PrivateRoute from "./Context/PrivateRoute.jsx";
import SignIn from "./Pages/SignIn/SignIn.jsx";
import UserAccessPage from "./Pages/UserAccessPage/UserAccessPage.jsx";
function App() {
  const { questions, setQuestions } = useContext(QuestionContext);
  const [user, setUser] = useContext(userProvider);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  function logOut() {
    setUser({});
    localStorage.removeItem("token"); // Change to remove the token
    navigate("/"); // Redirect to home or login page
  }

  async function checkUser() {
    try {
      // Check user authentication
      const { data } = await axios.get("/api/users/check", {
        headers: {
          Authorization: "Bearer " + token, // Pass token for authentication
        },
      });

      setUser({ userName: data.user_name, user_id: data.user_id }); // Set user data

      // Fetch all questions
      const res = await axios.get("/api/all-questions", {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token for authentication
        },
      });
      setQuestions(res.data.data); // Set questions data
    } catch (error) {
      console.error("Error checking user:", error); // Log error
      navigate("/"); // Redirect to landing page on error
    }
  }

  useEffect(() => {
    if (token) {
      // If the token exists
      checkUser(); // Call the checkUser function, which will set the user state
    } else {
      navigate("/"); // Redirect to the login page
    }
  }, []); // Run only once when the component mounts
  const isLandingPage = location.pathname === "/";
  return (
    <>
      {!isLandingPage && <Header logOut={logOut} />}
      <Routes>
        {/* <Route path="/" element={<ExternalPage />} /> */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route path="/questions/:question_id" element={<QuestionDetail />} />
        <Route path="/ask" element={<AskQuestion />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/UserAccessPage" element={<UserAccessPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
