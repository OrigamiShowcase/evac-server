import UnoCard, { Color, UnoCardType } from "./UnoCard";
import UnoPlayer from "./UnoPlayer";

export default class UnoResponse
{ 
    lastCard:UnoCard;
    player:UnoPlayer;
    turn:number=0;
    color:Color;    
    cardsNumber:number[]=[];
    clockwise:boolean=true;
    constructor(data:{
    lastCard:UnoCard;
    player:UnoPlayer;
    turn:number;
    color:Color;    
    clockwise:boolean;
    cardsNumber:number[];
        
    })
    {
        Object.assign(this,data);
    }
} 