import express from 'express';
import connectDB from './database/db.js';
import 'dotenv/config';
import userRoute from './routes/userroute.js';

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send("backend is working");
});

app.use('/user', userRoute);

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});