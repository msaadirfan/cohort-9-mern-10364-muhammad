import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan'
import authRouter from './routes/auth.routes.js';
import notesRouter from './routes/notes.routes.js';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middleware/error.middleware.js';
import logger from './utils/logger.js';

dotenv.config();


const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());


app.get('/', (req, res)=>{
    res.send("working");
});

app.use("/auth", authRouter);
app.use("/notes", notesRouter);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            logger.info(`Server is running at PORT: ${PORT}`);
        });
    })
    .catch((err) => {
        logger.error(err.message, "Database connection failed:");
        process.exit(1);
    });

export default app;