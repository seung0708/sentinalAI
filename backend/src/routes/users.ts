import express from 'express'
import {Router, Request, Response} from 'express';
import { supabase } from '../db/supabaseClient';
import {Database} from '../types/supabase'

const userRouter = express.Router();

userRouter.get('/', (req,res) => {
    res.send("Getting all users")
})

userRouter.post('/signUp', async (req:Request, res: Response): Promise<any> => {
  // const {name, email, password} = req.body;

  try{
    const {name, email, password} = req.body;
    const {data: authData, error: authError} = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if(authError || !authData.user){
        res.status(400).json({error:authError?.message})
    }

    type NewUser = Database['public']['Tables']['users']["Insert"] & {auth_id: string}

    const newUser: NewUser = {
      name:name,
      email:email,
      auth_id: authData.user?.id ?? '' // optional chaining - checks if authData.user.id is not null if valid then acces it. if invalid then set empty string
    };

   const { data, error: dbError } = await supabase.from('users').insert(newUser);

    if(dbError){
        return res.status(500).json({error: dbError.message})
    }

    res.status(201).json({message: "User Created Succesfully"})
  }catch(error){
    console.error('Registration error', error)
    res.status(500).json({error: "Something went wrong"})
  }
})

export default userRouter;