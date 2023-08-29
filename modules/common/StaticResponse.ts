import { ResponseErrorModel, RouteResponse } from "@origamicore/core";

export default class StaticResponse
{
    static  tokenNotFound:RouteResponse =new RouteResponse({error: new ResponseErrorModel({message:'Token not found',code:'001'})} );  
    static  accessDenied:RouteResponse =new RouteResponse({error: new ResponseErrorModel({message:'Access denied',code:'003'})} );  
    
}
