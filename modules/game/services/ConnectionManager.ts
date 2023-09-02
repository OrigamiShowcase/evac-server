import ResponseMessage from "../../common/models/response/ResponseMessage";

export default class ConnectionManager
{
    connections:Map<string,(data:ResponseMessage)=>void> =new Map<string,(data:ResponseMessage)=>void>();
    push(userid:string ,connection:(data:ResponseMessage)=>void)
    {
        this.connections.set(userid,connection);
    }
    remove(userid:string)
    {
        this.connections.delete(userid);
    }
    sendMessage(userid:string,message:any)
    {
        if(this.connections.has(userid))
        {
            this.connections.get(userid)(message)
        }
    }
}