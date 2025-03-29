const { StatusCodes } = require("http-status-codes"); 

const dbConnection = require('../db/config'); 

async function createAnswer(req, res) {
    const { user_id, question_id, answer } = req.body;
    
    if (!user_id || !question_id || !answer) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please enter all information" });
    }

    try {
        const query = "INSERT INTO answerTable (user_id, question_id, answer) VALUES (?, ?, ?)";
        const [result] = await dbConnection.query(query, [user_id, question_id, answer]);
        
        if (result) {
            return res.status(StatusCodes.CREATED).json({ msg: "Answer created successfully" });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to create answer" });
        }
    } catch (error) {
        console.error("Error creating answer:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong" });
    }
}



async function GetAnswersByQuestionId(req,res){
    const {question_id}= req.params;
    try {
        const query="SELECT * FROM answerTable WHERE question_id = ?";
        const [result] =await dbConnection.query(query,[question_id])
        if (result.length > 0) {
            return res.status(StatusCodes.OK).json({result});
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "Question not found" });
        }
    } catch (error) {
        console.error("Error fetching question detail:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong" });
    }
}




// async function GetAnswersByQuestionId(req, res) {
//     try {
//       console.log("Request params:", req.params); // Debug log for params
//       const question_id = req.params.question_id; // Convert to integer
//       console.log("Requested question_id:", question_id); // Debug log for question_id
//       const [question] = await dbconnection.query(
//         "SELECT * FROM questions WHERE question_id = ?",
//         [question_id]
//       );
//       if (question.length === 0) {
//         return res.status(404).json({ msg: "Question not found" });
//       }
//       const [answers] = await dbconnection.query(
//         // "SELECT * FROM answers WHERE question_id = ?",
//         `SELECT a.answer_id, a.answer, a.user_id, u.user_name
//          FROM answers a
//          JOIN users u ON a.user_id = u.user_id
//          WHERE a.question_id = ?`,
//         [question_id]
//       );
//       res.status(200).json({ question: question[0], answers });
//     } catch (err) {
//       console.error("Error in gettingAnswer:", err);
//       res.status(500).json({ msg: "Server error" });
//     }
//   }



module.exports = {
    createAnswer,
    GetAnswersByQuestionId
};






 

// async function GetAnswersByQuestionId(req, res) {
//     try {
//       console.log("Request params:", req.params); // Debug log for params
//       const question_id = req.params.question_id; // Convert to integer
//       console.log("Requested question_id:", question_id); // Debug log for question_id
//       const [question] = await dbconnection.query(
//         "SELECT * FROM questions WHERE question_id = ?",
//         [question_id]
//       );
//       if (question.length === 0) {
//         return res.status(404).json({ msg: "Question not found" });
//       }
//       const [answers] = await dbconnection.query(
//         // "SELECT * FROM answers WHERE question_id = ?",
//         `SELECT a.answer_id, a.answer, a.user_id, u.user_name
//          FROM answers a
//          JOIN users u ON a.user_id = u.user_id
//          WHERE a.question_id = ?`,
//         [question_id]
//       );
//       res.status(200).json({ question: question[0], answers });
//     } catch (err) {
//       console.error("Error in gettingAnswer:", err);
//       res.status(500).json({ msg: "Server error" });
//     }
//   }