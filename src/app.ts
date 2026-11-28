import express from 'express';
import cookieParser from "cookie-parser";
import { router } from './route';
import cors from 'cors'

export function createApp(){
 
    const app=express()
    app.use(express.json())

app.use(cookieParser());
app.use(cors({origin:'*'}))
app.post('/',(req,res)=>{
console.log(req.body);
res.json('okl')
  
})
    app.use('/api',router)

    return app
}