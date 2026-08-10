import sessionModel from "../models/session.model.js";
import jwt from 'jsonwebtoken';
import logger from "../utils/logger.js";

const auth = async(req, res, next)=>{
    try{
    const accessToken = req.headers.authorization?.split(" ")[1];

    if(!accessToken){
        logger.error("Access token not found");
        return res.status(401).json({
            message: "Access token not found"
        })
    }

    
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    
    

    const session = await sessionModel.findOne({
        _id : decoded.sessionId,
        user: decoded.id,
        revoked: false
    })

    if(!session){
        logger.error("Unauthorized");
        return res.status(400).json({
            message: "Unauthorized"
        })
    }

    req.user = {
        id: decoded.id,
        sessionId: decoded.sessionId
    }

    next();
}
    catch(err){
        logger.error(err.message, "Invalid Access Token");
        return res.status(401).json({
            message: "Invalid Access Token",
            error: err.message
        })
    }
}

export default auth;