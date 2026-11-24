import express from 'express';
import cookieParser from "cookie-parser";
import { router } from './route';
export function createApp(){
 
    const app=express()
    app.use(express.json())

app.use(cookieParser());

    app.use('/api',router)

    return app
}