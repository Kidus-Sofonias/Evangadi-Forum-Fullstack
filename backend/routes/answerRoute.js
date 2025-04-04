const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleWare/authMiddleware");
const {
  createAnswer,
  GetAnswersByQuestionId,
  isQuestionAnswered,
} = require("../controller/answer");

router.post("/answers/create", authMiddleware, createAnswer);

router.get("/answers/all/:question_id", authMiddleware, GetAnswersByQuestionId);

// New route to check if a question is answered
router.get(
  "/questions/:question_id/is_answered",
  authMiddleware,
  isQuestionAnswered
);

module.exports = router;
// /answers/all/:questionId
