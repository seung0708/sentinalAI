import express from 'express'
import {Router} from 'express';

const userRouter = express.Router();

userRouter.get('/', (req,res) => {
    res.send("Getting all users")
})

export default userRouter;