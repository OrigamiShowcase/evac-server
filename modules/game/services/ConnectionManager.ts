import ResponseMessage from "../../common/models/response/ResponseMessage";

export default class ConnectionManager
{
    static connections:Map<string,(data:ResponseMessage)=>void> =new Map<string,(data:ResponseMessage)=>void>();
    static push(userid:string ,connection:(data:ResponseMessage)=>void)
    {
        this.connections.set(userid,connection);
    }
    static remove(userid:string)
    {
        this.connections.delete(userid);
    }
    static sendMessage(userid:string,message:ResponseMessage)
    {
        if(this.connections.has(userid))
        {
            this.connections.get(userid)(message)
        }
    }
}