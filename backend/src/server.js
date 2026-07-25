import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();

app.get('/', (req, res)=>{
res.end("Hello World");
});

const PORT = 3000;
connectDB().then(()=>{app.listen(3000, ()=>{
console.log(`Server is running at PORT: ${PORT}`);
})});