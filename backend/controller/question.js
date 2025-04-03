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

    return res.status(StatusCodes.CREATED).json({
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
    const [countResult] = await dbConnection.query(
      "SELECT COUNT(*) as total FROM questionTable"
    );
    const total = countResult[0].total;

    const questionData = `
      SELECT q.*, u.first_name, u.last_name,
        (SELECT COUNT(*) FROM answerTable a WHERE a.question_id = q.question_id) > 0 AS is_answered
      FROM questionTable q
      JOIN userTable u ON q.user_id = u.user_id
      ORDER BY q.id DESC
      LIMIT ? OFFSET ?
    `;

    const [result] = await dbConnection.query(questionData, [limit, offset]);

    return res.status(StatusCodes.OK).json({ result, total });
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
    const getQuestion = `
      SELECT q.*, u.first_name, u.last_name 
      FROM questionTable q 
      JOIN userTable u ON q.user_id = u.user_id 
      WHERE q.question_id = ?
    `;

    const [result] = await dbConnection.query(getQuestion, [question_id]);

    if (result.length > 0) {
      return res.status(StatusCodes.OK).json({ result });
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
  const { tag } = req.query;

  if (!tag) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Tag is required" });
  }

  try {
    const searchQuery = `
      SELECT q.*, u.first_name, u.last_name
      FROM questionTable q
      JOIN userTable u ON q.user_id = u.user_id
      WHERE LOWER(q.tag) LIKE ? OR LOWER(q.title) LIKE ?
      ORDER BY q.id DESC
    `;

    const searchTerm = `%${tag.toLowerCase()}%`;

    const [result] = await dbConnection.query(searchQuery, [
      searchTerm,
      searchTerm,
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
