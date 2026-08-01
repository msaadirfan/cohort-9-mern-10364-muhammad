import userModel from '../models/user.model.js';
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
        res.status(409).json({
            message: "Username or Email already exists"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = await userModel.create({
        username,
        email,
        password : hashedPassword
    })

    const accessToken = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET,{
        expiresIn: "15m"
    } 
    )
    
    const refreshToken = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET,{
        expiresIn: "7d"
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

    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id)

    if(!user){
        res.status(404).json({
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

        const accessToken = jwt.sign({
            id: decoded.id,
        }, process.env.JWT_SECRET,{
            expiresIn: "15m"
        });

        const newRefreshToken = jwt.sign({
            id: decoded.id,
        }, process.env.JWT_SECRET,{
            expiresIn: "7d"
        } 
        );

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




