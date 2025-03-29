
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

async function authMiddleware (req, res, next){
const authHeader= req.headers.authorization;
if(!authHeader || !authHeader.startsWith('Bearer ')){
return res.status(StatusCodes.UNAUTHORIZED).json({message:"Authentication invalid"})
}
const token = authHeader.split(' ')[1] // get token from header

try {
    const {user_name, user_id} = jwt.verify(token, process.env.JWT_SECRET)
    
    // create request object
    req.user = { user_name, user_id }
   next()
} catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({message:"Authentication denied"}) 
}
} 
module.exports = authMiddleware 


