import { MongoRouter } from "@origamicore/mongo";
import { RedisRouter } from "@origamicore/redis";
import ProfileModel from "../auth/models/ProfileModel";
import GameModel from "../game/models/GameModel";
import UnoGame from "../uno/models/UnoGame";

export default class DbSchemas
{ 
    static profile:MongoRouter<ProfileModel>;   
    static games:MongoRouter<GameModel>;   
    static uno:MongoRouter<UnoGame>;   
    static redis:RedisRouter; 
    static init(mongoContext:string,redisContext:string)
    {
        this.profile=new MongoRouter(mongoContext,'profile',ProfileModel) ;   
        this.games=new MongoRouter(mongoContext,'games',GameModel) ;   
        this.uno=new MongoRouter(mongoContext,'uno',UnoGame) ;   
        this.redis=new RedisRouter(redisContext);
    }
}