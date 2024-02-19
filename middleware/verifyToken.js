const jwt = require('jsonwebtoken')
const verifyToken = (req,res,next)=>{
    const autHeader = req.headers['Authorization'] || req.headers['authorization']
    if(!autHeader){
        res.status(401).json('token is not found')
        next()
    }
    const token = autHeader.split(" ")[1]
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // here to make currentUser avaliable to any next middleware
        req.currentUser = currentUser
        next()
        
    } catch (error) {
        res.status(401).json('invalid token')
        next()
    }
}
module.exports = verifyToken