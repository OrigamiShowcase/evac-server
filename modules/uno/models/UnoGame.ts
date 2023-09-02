import Manager from "../../common/Manager";
import { GameState } from "../../game/models/GameState";
import UnoCard, { Color } from "./UnoCard";
import UnoPlayer from "./UnoPlayer";
import UnoResponse from "./UnoResponse";

export default class UnoGame
{
    _id:string;
    lossCards:UnoCard[]=[];
    cardsNumber:number[]=[];
    temp:UnoCard[]=[];
    cards:UnoCard[]=[];
    players:UnoPlayer[]=[]
    turn:number=0;
    color:Color;    
    number:number;
    state:GameState;
    clockwise:boolean=true;
    constructor(data:any)
    {
        Object.assign(this,data);
    }
    sendMessage( )
    {
        let card=this.lossCards[this.lossCards.length]
        for(let player of this.players)
        {
            Manager.uno.sendMessage(player.userid,new UnoResponse({
                clockwise:this.clockwise,
                color:this.color,
                lastCard:card,
                turn:this.turn,
                player:player,
                cardsNumber:this.cardsNumber
            }))
        }
    }
}