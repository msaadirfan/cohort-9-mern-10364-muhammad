import userModel from '../models/user.model.js';
import sessionModel from '../models/session.model.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';


export const register = async(req, res)=>{

    const {username, email, password} = req.body;

    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            {username},
            {email},
    ]})

    if(isAlreadyRegistered){
        return res.status(409).json({
            message: "Username or Email already exists"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = await userModel.create({
        username,
        email,
        password : hashedPassword
    })

    
    
    const refreshToken = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET,{
        expiresIn: "7d"
    } 
    )

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash: crypto.createHash("sha256").update(refreshToken).digest("hex"),
        ip: req.ip,
        userAgent: req.headers['user-agent']
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, process.env.JWT_SECRET,{
        expiresIn: "15m"
    } 
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
    })

    res.status(201).json({
        message: "User created successfully",
        user: {
            username:user.username,
            email:user.email
        },
        token: {
            accessToken
        }
    })
}

export const getMe= async(req, res)=>{

    const userId = req.user.id;

    const user = await userModel.findById(userId)

    if(!user){
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json({
        message:"user fetched successfully",
        user: {
            username: user.username,
            email: user.email
        }
    }
    )
}

export const refreshToken = async(req, res)=>{

    const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const decoded = jwt.verify(
            refreshToken, process.env.JWT_SECRET
        );

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        });

        if(!session){
            return res.status('401').json({
                message: "Invalid refresh token"
            })
        }

        const accessToken = jwt.sign({
            id: decoded.id,
            sessionId: session._id
        }, process.env.JWT_SECRET,{
            expiresIn: "15m"
        });

        const newRefreshToken = jwt.sign({
            id: decoded.id,
        }, process.env.JWT_SECRET,{
            expiresIn: "7d"
        } 
        );

        const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

        session.refreshTokenHash = newRefreshTokenHash;
        await session.save();

        

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
        });

        res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken
        });
}

export const logout = async(req, res)=>{

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const session = await sessionModel.findOne({
        refreshTokenHash: crypto.createHash("sha256").update(refreshToken).digest("hex"),
        revoked: false
    });

    if(!session){
        return res.status(401).json({
            message: "Invalid refresh token"
        })
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");
    res.status(200).json({
        message: "Logged out successfully"
    });
}


export const logoutAll = async(req, res) =>{

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    const session = await sessionModel.updateMany({
        user: decoded.id,
        revoked: false
    }, {
        revoked: true
    });

    if(session.matchedCount == 0){
        return res.status(400).json({
            message: "No active sessions found"
        })
    }

    res.clearCookie("refreshToken");

    res.status(200).json({
        message: "Logged out of all devices successfully"
    })
}

export const login = async(req, res)=>{
    const {email, password}=req.body;
    
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = await userModel.findOne({
       email: email,
       password:hashedPassword
        
    });

    if(!user){
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }

    
    const refreshToken = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET,{
        expiresIn: "7d"
    } 
    )

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash: crypto.createHash("sha256").update(refreshToken).digest("hex"),
        ip: req.ip,
        userAgent: req.headers['user-agent']
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, process.env.JWT_SECRET,{
        expiresIn: "15m"
    } 
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
    })

    res.status(200).json({
        message: "Logged in successfully",
        username: user.username,
        accessToken
    })
}

