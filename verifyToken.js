//(source: [3])

//token verification for user login using jsonwebtoken package
const jsonwebtoken = require('jsonwebtoken')

function auth(req, res, next){
    //get token from header
    const token = req.header('auth-token')
    //check if a token has been provided
    if(!token){
        return res.status(401).send({message:'Access denied.'})
    }
    try{
        //validate token
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        req.user.userId = req.user._id
        next()
    }catch(err){
        return res.status(401).send({message:'Invalid token.'})

    }
}

module.exports = auth