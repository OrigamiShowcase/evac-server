import { MongoRouter } from "@origamicore/mongo";
import { RedisRouter } from "@origamicore/redis";
import ProfileModel from "../auth/models/ProfileModel";

export default class DbSchemas
{ 
    static profile:MongoRouter<ProfileModel>;   
    static redis:RedisRouter; 
    static init(mongoContext:string,redisContext:string)
    {
        this.profile=new MongoRouter(mongoContext,'profile',ProfileModel) ;   
        this.redis=new RedisRouter(redisContext);
    }
}