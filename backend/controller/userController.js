const dbConnection = require('../db/config');
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
    const { user_name, first_name, last_name, email, password } = req.body;
    if (!user_name || !first_name || !last_name || !email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide all required fields" });
    }
    
    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10); // Generate salt for hashing password
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if user already exists
        const [rows] = await dbConnection.query(
            "SELECT user_name, user_id FROM userTable WHERE user_name = ? OR email = ?", // Prepared statement to prevent SQL injection attacks.
            [user_name, email]
        );

        if (rows.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "User already registered" });
        }

        if (password.length < 8) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Password must be at least 8 characters" });
        }

        // Insert new user
        await dbConnection.query(
            "INSERT INTO userTable (user_name, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)", // Prepared statement to prevent SQL injection attacks. 
            [user_name, first_name, last_name, email, hashedPassword]
        );

        return res.status(StatusCodes.CREATED).json({ msg: "User created successfully" });
        
    } catch (error) {
        console.error(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong, try again later" });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide email and password" });
    }

    try {
        // Query the database for the user by email
        const [rows] = await dbConnection.query(
            "SELECT user_id, user_name, email, password FROM userTable WHERE email = ?", 
            [email]
        );

        if (rows.length === 0) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid email or password" });
        }

        const storedUser = rows[0];

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, storedUser.password);
        
        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { user_name: storedUser.user_name, user_id: storedUser.user_id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );

        return res.status(StatusCodes.OK).json({ 
            msg: "User login successful", 
            user_name: storedUser.user_name, 
            user_id: storedUser.user_id, 
            token 
        }); 

    } catch (error) {
        console.error(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong, try again later" });
    }
}

async function checkUser(req, res) {
    const user_name = req.user.user_name;
    const user_id = req.user.user_id;
    res.status(StatusCodes.OK).json({ msg: "Valid user", user_name, user_id });
}

module.exports = {
    register,
    login,
    checkUser
};
