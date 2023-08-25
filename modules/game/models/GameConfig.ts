import { ModuleConfig, PackageIndex } from "@origamicore/core";
import GameService from "../Index";
export default class GameConfig extends ModuleConfig
{
    async createInstance(): Promise<PackageIndex> {
        var instance=new GameService();
        await instance.jsonConfig(this);
        return instance;
    }
    dbContext:string;
    redisContext:string;
    public constructor(
        
        fields?: {
            id?:string
            name?: string, 
            dbContext?:string  
            redisContext:string;
        }) {

        super(fields);
        if (fields) Object.assign(this, fields);
    }
}