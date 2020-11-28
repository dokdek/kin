const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

crypto.randomBytes(64).toString('hex');

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null){
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.TOKEN_SECRET,(err, user) => {
        console.log(err);
        if(err){ 
            return res.sednStatus(403);
        }
        req.user = user;
        next();
    });
}

export default authenticateToken;