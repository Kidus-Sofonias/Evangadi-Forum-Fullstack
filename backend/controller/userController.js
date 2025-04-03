const dbConnection = require("../db/config");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { user_name, first_name, last_name, email, password } = req.body;
  if (!user_name || !first_name || !last_name || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [rows] = await dbConnection.query(
      "SELECT user_name, user_id FROM userTable WHERE user_name = ? OR email = ?",
      [user_name, email]
    );

    if (rows.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User already registered" });
    }

    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters" });
    }

    await dbConnection.query(
      "INSERT INTO userTable (user_name, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)",
      [user_name, first_name, last_name, email, hashedPassword]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User created successfully" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide email and password" });
  }

  try {
    const [rows] = await dbConnection.query(
      "SELECT user_id, user_name, first_name, last_name, email, password FROM userTable WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid email or password" });
    }

    const storedUser = rows[0];
    const isMatch = await bcrypt.compare(password, storedUser.password);

    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      { user_name: storedUser.user_name, user_id: storedUser.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(StatusCodes.OK).json({
      msg: "User login successful",
      user_name: storedUser.user_name,
      user_id: storedUser.user_id,
      first_name: storedUser.first_name,
      last_name: storedUser.last_name,
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}

async function checkUser(req, res) {
  const { user_id } = req.user;

  try {
    const [rows] = await dbConnection.query(
      "SELECT user_id, user_name, first_name, last_name FROM userTable WHERE user_id = ?",
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }

    const user = rows[0];

    return res.status(StatusCodes.OK).json({
      msg: "Valid user",
      user_id: user.user_id,
      user_name: user.user_name,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (error) {
    console.error("checkUser error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error verifying user" });
  }
}


module.exports = {
  register,
  login,
  checkUser,
};
