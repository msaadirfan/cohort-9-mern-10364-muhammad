import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan'
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.get('/', (req, res)=>{
    res.send("working");
});

app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 3000;
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at PORT: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    });