import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";


export function genrateToken(payLoad:JwtPayload){
    return jwt.sign(payLoad,env.jwt.secretKey,{expiresIn:'1h'})
}