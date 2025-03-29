const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

const dbConnection = require("../db/config");

async function createQuestion(req, res) {
  const { title, user_id, question_description, tag } = req.body;

  if (!title || !question_description || !user_id || !tag) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter all information fully" });
  }

  const question_id = uuidv4();
  try {
    const data =
      "INSERT INTO questionTable (question_id, user_id, title, question_description, tag) VALUES (?,?,?,?,?)";
    const [result] = await dbConnection.query(data, [
      question_id,
      user_id,
      title,
      question_description,
      tag,
    ]);

    return res
      .status(StatusCodes.CREATED)
      .json({
        msg: "Question created successfully",
        question_id: result.insertId,
      });
  } catch (error) {
    console.error("Error creating question:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong" });
  }
}

async function allQuestions(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const offset = (page - 1) * limit;

  try {
    // Get total count for pagination
    const [countResult] = await dbConnection.query(
      "SELECT COUNT(*) as total FROM questionTable"
    );
    const total = countResult[0].total;

    // Fetch paginated results
    const questionData = `
            SELECT * FROM questionTable 
            ORDER BY id DESC 
            LIMIT ? OFFSET ?
        `;
    const [result] = await dbConnection.query(questionData, [limit, offset]);

    if (result.length > 0) {
      return res.status(StatusCodes.OK).json({ result, total });
    } else {
      return res.status(StatusCodes.OK).json({ result: [], total });
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong" });
  }
}

async function getQuestionDetail(req, res) {
  const question_id = req.params.question_id;

  try {
    const getQuestion = "SELECT * FROM questionTable WHERE question_id = ?";
    const [result] = await dbConnection.query(getQuestion, [question_id]);

    if (result.length > 0) {
      return res.status(StatusCodes.OK).json({ result: result });
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }
  } catch (error) {
    console.error("Error fetching question detail:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong" });
  }
}

async function searchQuestionsByTag(req, res) {
  const { query } = req.query;

  if (!query) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Search query is required" });
  }

  try {
    // Using SQL LIKE to match similar tags or titles (case-insensitive search)
    const searchQuery = `
            SELECT * FROM questionTable 
            WHERE tag LIKE ? OR title LIKE ? 
            ORDER BY id DESC
        `;
    const [result] = await dbConnection.query(searchQuery, [
      `%${query}%`,
      `%${query}%`,
    ]);

    return res.status(StatusCodes.OK).json({ result });
  } catch (error) {
    console.error("Error searching questions by tag or title:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong" });
  }
}

module.exports = {
  createQuestion,
  allQuestions,
  getQuestionDetail,
  searchQuestionsByTag,
};
