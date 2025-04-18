import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export const jwtMiddleware = (req, res, next) => {
    //get the token
    const {jwtToken} = req.cookies;
    if(!jwtToken){
        return res.status(401).send("There is no token.Please Login first")
    }
    try{
        const payLoad = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = payLoad;
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).send("Authorisation failed")
    }

}