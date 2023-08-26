import { DataInput, EventInput, ModuleConfig, OriInjectable, OriService, PackageIndex, ResponseDataModel, RouteResponse, SessionInput } from "@origamicore/core";
import AuthConfig from "./models/AuthConfig";
import SessionModel from "../common/models/SessionModel";
import ResponseMessage from "../common/models/response/ResponseMessage";
import { WebService } from "@origamicore/base";
import EnvModel from "../common/models/EnvModel";

@OriInjectable({domain:'auth'})
export default class AuthService implements PackageIndex
{
    name:string='auth';
    config:AuthConfig;
    jsonConfig(moduleConfig: ModuleConfig): Promise<void> { 
        this.config=moduleConfig as AuthConfig;
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
    
    @OriService()
    async isLogin(@SessionInput session:SessionModel):Promise<any>
    {
        return session;
    }
    
    @OriService({isPublic:true})
    async requestLoginToken():Promise<any>
    {
        var request:any =await WebService.get(EnvModel.ajorLoginUrl,
        {
            name:process.env.AJOR_NAME,
            key:process.env.AJOR_KEY
        },null,null)
        return request.data;
    }

    @OriService({isPublic:true})
    async loginByAjor(id:string):Promise<any> 
    { 
        var request:any =await WebService.get(EnvModel.ajorUrl,
        {
            name:EnvModel.ajorName,
            key:EnvModel.ajorKey,
            id
        },null,null);        
        var accountData=request.data; 
        if(!accountData.account) throw 'access'
        return  new RouteResponse({
            session: {
                'userid':accountData.account
            },
            response:new ResponseDataModel()
        });

    
    }
}