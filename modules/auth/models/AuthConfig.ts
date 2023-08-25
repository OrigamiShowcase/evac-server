import { ModuleConfig, PackageIndex } from "@origamicore/core";
import AuthService from "../Index";
export default class AuthConfig extends ModuleConfig
{
    async createInstance(): Promise<PackageIndex> {
        var instance=new AuthService();
        await instance.jsonConfig(this);
        return instance;
    }
    dbContext:string;
    redisContext:string;
    public constructor(
        
        fields?: {
            id?:string;
            name?: string;
            dbContext?:string;  
            redisContext:string;
        }) {

        super(fields);
        if (fields) Object.assign(this, fields);
    }
}