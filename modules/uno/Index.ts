import { DataInput, ModuleConfig, OriInjectable, OriService, PackageIndex, SessionInput } from "@origamicore/core";
import UnoConfig from "./models/UnoConfig";

@OriInjectable({domain:'uno'})
export default class UnoService implements PackageIndex
{
    name:string='uno';
    config:UnoConfig;
    jsonConfig(moduleConfig: ModuleConfig): Promise<void> { 
        this.config=moduleConfig as UnoConfig;
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
    
    @OriService({isPublic:true})
    test(@SessionInput session)
    {

    }
}