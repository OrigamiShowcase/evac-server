import { ModuleConfig, PackageIndex } from "@origamicore/core";
import UnoService from "../Index";
export default class UnoConfig extends ModuleConfig
{
    async createInstance(): Promise<PackageIndex> {
        var instance=new UnoService();
        await instance.jsonConfig(this);
        return instance;
    }
    dbContext:string;
    public constructor(
        
        fields?: {
            id?:string
            name?: string, 
            dbContext?:string  
        }) {

        super(fields);
        if (fields) Object.assign(this, fields);
    }
}