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


module.exports = {
    createAnswer,
    GetAnswersByQuestionId
};
