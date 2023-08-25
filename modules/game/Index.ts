import { DataInput, EventInput, ModuleConfig, OriInjectable, OriService, PackageIndex, SessionInput } from "@origamicore/core";
import GameConfig from "./models/GameConfig"; 
import DbSchemas from "../common/DbSchemas";
import SessionModel from "../common/models/SessionModel";
import ResponseMessage from "../common/models/response/ResponseMessage";

@OriInjectable({domain:'game'})
export default class GameService implements PackageIndex
{
    name:string='game';
    config:GameConfig;
    jsonConfig(config: GameConfig): Promise<void> { 
        this.config=config;
        DbSchemas.init(config.dbContext,config.redisContext)
        return ;
    }
    start(): Promise<void> {
        return;
    }
    restart(): Promise<void> {
        return;
    }
    stop(): Promise<void> {
        return;
    }
    
    @OriService({isEvent:true})
    async listen(@SessionInput session:SessionModel,@EventInput event:(data:ResponseMessage)=>void)
    {
        
    }
    @OriService({isInternal:true})
    async closeSession(@SessionInput session:SessionModel)
    {   
    }
}