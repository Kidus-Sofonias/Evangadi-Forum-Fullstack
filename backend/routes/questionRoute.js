const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleWare/authMiddleware");
const {
  createQuestion,
  allQuestions,
  getQuestionDetail,
  searchQuestionsByTag,
} = require("../controller/question");

// use get for getting question detail
router.get("/detail-question/:question_id", authMiddleware, getQuestionDetail);

// Use POST for creating a new question
router.post("/create-question", authMiddleware, createQuestion);

// Use GET for retrieving all questions
router.get("/all-questions", authMiddleware, allQuestions);

router.get("/search", searchQuestionsByTag);


module.exports = router;
