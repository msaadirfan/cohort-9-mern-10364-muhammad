import mongoose from 'mongoose';
export const connectDB = async() =>{

    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI is not defined in .env file");
    }

    if(!process.env.JWT_SECRET){
        throw new Error("JWT_SECRET is not defined in .env file");
    }

    try{

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    }

    catch(err){
        throw new Error(`Error in connecting to MongoDB: ${err.message}`);
    }

};