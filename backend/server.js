import express from 'express';
import connectDB from './database/db.js';
import 'dotenv/config';

const app = express();

const PORT = process.env.PORT ;

connectDB();

app.get('/',(req,res)=>{
    res.send("backend is working");
});


app.listen(PORT,()=>{
    console.log(`The server is running on port ${PORT}`);
});