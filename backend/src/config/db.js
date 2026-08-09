import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const connectDB = async() =>{

    if(!process.env.MONGO_URI){
        logger.error("MONGO_URI is not defined in .env file");
        throw new Error("MONGO_URI is not defined in .env file");
    }
    
    if(!process.env.JWT_SECRET){
        logger.error("JWT_SECRET is not defined in .env file");
        throw new Error("JWT_SECRET is not defined in .env file");
    }

    try{

        await mongoose.connect(process.env.MONGO_URI);
        logger.info("MongoDB connected successfully");
    }
    
    catch(err){
        logger.error(err.message, "MongoDB connected successfully");
        throw new Error(`Error in connecting to MongoDB: ${err.message}`);
    }

};