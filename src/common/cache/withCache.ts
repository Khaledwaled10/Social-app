import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { TOKENS } from '../di/tokens';
import { ICacheProvider } from '../../pkj/cache/redis';

const cacheProvider=container.resolve<ICacheProvider>(TOKENS.CacheProvider)
export async function withCache(ttl=3600){
    return async (req:Request,res:Response,next:NextFunction)=>{
 if (req.method !== 'GET') {
        return next();
      }
        let key=`${req.method}:${req.originalUrl}`
       const cache=await cacheProvider.get(key)
if(cache){
        res.setHeader('X-Cache','HIT')

    return res.json( JSON.parse( cache))
}

const originalJson=res.json.bind(res)


// if(!cache){

//     async (body)=>{
//         await cacheProvider.set(key,JSON.stringify(body))
//         res.setHeader('X-Cache','MISS')

//         return res.json(body)

//     }


// }

res.json=(
    (body)=>{

    if(res.statusCode>=200&&res.statusCode<300){
 cacheProvider.set(key,JSON.stringify(body),ttl)

        res.setHeader('X-Cache','MISS')
        
    }
        
        return originalJson(body)
    }
)

        next();
    }
}