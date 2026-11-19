
import { Redis } from "@upstash/redis";
import { env } from "../../common/config/env";

 interface ICacheProvider {
    set(
    key: string,
    value: string,
    ttl?: number
  ):Promise<void>;

  get(key: string): Promise<string | null>;

  del(key: string): Promise<void>;
}



export class RediasCacheProvider implements ICacheProvider{
    private readonly client: Redis;
  constructor() {
    this.client = new Redis({
      url:env.upstash.url,
      token:env.upstash.redis_token,
    });
  }

  async set(key:string, value:string, ttl?:number):Promise<void> {
    if (ttl) {
      await this.client.set(key, value, { ex: ttl });
      return
    }

    await this.client.set(key, value);
    return 
  }
  
async get(key: string): Promise<string | null> {
  const value = await this.client.get<string | number>(key);

  return value === null ? null : String(value);
}

  async del(key:string):Promise<void> {
    await this.client.del(key);
    return 
  }
}
