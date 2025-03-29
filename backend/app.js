const express = require("express");
const cors = require("cors");
const dbConnection = require("./db/config");

const app = express(); // Initialize express app instance

// Middlewares
app.use(express.json()); // Parse incoming request body in JSON format
app.use(cors());

//
const PORT = 5000;

const createTables = async () => {
  // SQL query to create the Users table
  let user_table = `CREATE TABLE IF NOT EXISTS userTable (
    user_id INT(30) AUTO_INCREMENT,
    user_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY (user_id)
  )`;

  // SQL query to create the Questions table
  let question_table = `CREATE TABLE IF NOT EXISTS questionTable (
    id INT(30) NOT NULL AUTO_INCREMENT,
    question_id VARCHAR(120) NOT NULL UNIQUE,
    user_id INT(30) NOT NULL, 
    title VARCHAR(70) NOT NULL,
    question_description VARCHAR(300) NOT NULL,
    tag VARCHAR(255),
    PRIMARY KEY (id, question_id),
    FOREIGN KEY (user_id) REFERENCES userTable(user_id) ON DELETE CASCADE 
  )`;

  // SQL query to create the Answers table
  let answer_table = `CREATE TABLE IF NOT EXISTS answerTable (
    answer_id INT(30) NOT NULL AUTO_INCREMENT,
    user_id INT(30) NOT NULL,
    question_id VARCHAR(120) NOT NULL,
    answer VARCHAR(300) NOT NULL,
    PRIMARY KEY (answer_id),
    FOREIGN KEY (user_id) REFERENCES userTable(user_id),
    FOREIGN KEY (question_id) REFERENCES questionTable(question_id) ON DELETE CASCADE 
  )`;

  try {
    // Execute each query sequentially
    await dbConnection.execute(user_table);
    await dbConnection.execute(question_table);
    await dbConnection.execute(answer_table);
    console.log("Tables created successfully");
  } catch (err) {
    console.log("Error creating tables:", err.message);
    throw err;
  }
};

const start = async () => {
  try {
    const result = await dbConnection.execute("select 'test' ");
    await createTables(); // Ensure tables are created before starting the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    console.log("Database connected successfully");
    console.log(`Listening to PORT: ${PORT}`);
  } catch (error) {
    console.log(error.message);
  }
};
start();

// Default route
app.get("/", async (req, res) => {
  res.send("Welcome");
});

// User route middleware file
const userRoute = require("./routes/userRoute");
const questionRoute = require("./routes/questionRoute");
const answerRoute = require("./routes/answerRoute");
// const authMiddleware = require("./middleware/authMiddleware");

// users routes middleware
app.use("/api/users", userRoute);

// questions routes middleware
app.use("/api", questionRoute);

// answers routes middleware
app.use("/api", answerRoute);

module.exports = app;
