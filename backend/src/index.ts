import express, { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/users' 
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

const app = express();

app.use(cors())
app.use(bodyParser.json())

app.use('/users', userRouter)

const port = process.env.PORT || 3000; 

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send("Server is live");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
