import sessionModel from "../models/session.model.js";
import jwt from 'jsonwebtoken';

const auth = async(req, res, next)=>{
    try{
    const accessToken = req.headers.authorization?.split(" ")[1];

    if(!accessToken){
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
        return res.status(401).json({
            message: "Invalid Access Token",
            error: err.message
        })
    }
}

export default auth;