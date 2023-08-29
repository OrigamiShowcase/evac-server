import { DataInput, EventInput, ModuleConfig, OriInjectable, OriService, PackageIndex, ResponseDataModel, RouteResponse, SessionInput } from "@origamicore/core";
import AuthConfig from "./models/AuthConfig";
import SessionModel from "../common/models/SessionModel";
import DbSchemas from "../common/DbSchemas";
import StaticResponse from "../common/StaticResponse";
import { GoogleOauthRouter } from "@origamicore/google-auth";
import ProfileModel from "./models/ProfileModel";
const uuid=require('uuid')
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
    async requestLogin(@SessionInput session:SessionModel)
    {
        let id=uuid.v4();
        await DbSchemas.redis.setValue(id,session.userid);
        await DbSchemas.redis.expire(id,120);
        return id;
    }
    @OriService()
    async isLogin(@SessionInput session:SessionModel)
    {
        return session;
    }
    @OriService({isPublic:true})
    async loginByToken(id:string,projectId:string)
    {
        let userid=await DbSchemas.redis.getValue(id);
        if(!userid)
        {
            return StaticResponse.tokenNotFound;
        }
        return new RouteResponse({
            session:new SessionModel({
                userid:userid,
                projectId
            })
        })
    }
    @OriService({isPublic:true})
    async login(id:string)
    {
        let gprofile = await GoogleOauthRouter.verifyById(id);
        let profile = await DbSchemas.profile.findById(gprofile.id);
        if(!profile)
        {
            profile=new ProfileModel({
                _id:gprofile.id,
                avatar:gprofile.picture,
                email:gprofile.email,
                firstName:gprofile.family_name,
                lastName:gprofile.family_name,
                status:1,
                username:''
            });
            await DbSchemas.profile.saveById(profile)
        }
        return new RouteResponse({
            session:new SessionModel({
                userid:profile._id
            })
        })
    }
}