
import GameModel from '../../../game/models/GameModel';
import {ResponseType} from './ResponseType'
export default class ResponseMessage
{
    type:ResponseType;
    game:GameModel
    constructor(data:{
        type:ResponseType;
        game:GameModel
    })
    {
        Object.assign(this,data);
    }
}