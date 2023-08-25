
import {ResponseType} from './ResponseType'
export default class ResponseMessage
{
    type:ResponseType;
    constructor(data:{
        type:ResponseType;
    })
    {
        Object.assign(this,data);
    }
}