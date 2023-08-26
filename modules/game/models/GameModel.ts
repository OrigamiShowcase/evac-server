import ResponseMessage from "../../common/models/response/ResponseMessage";
import ConnectionManager from "../services/ConnectionManager";
import { GameState } from "./GameState";
import PlayerModel from "./PlayerModel";
import { ResponseType } from "../../common/models/response/ResponseType";

export default class GameModel
{
    _id:string;
    players:PlayerModel[]=[]
    turn:number=0;
    dices:number[]=[];
    state:GameState=GameState.Waiting;
    timeout:number;
    locks:number[]=[];
    constructor(data:any)
    {
        Object.assign(this,data);
    }
    sendMessage(type:ResponseType)
    {
        for(let player of this.players)
        {
            ConnectionManager.sendMessage(player.userid,new ResponseMessage({type,game:this}))
        }
    }
}