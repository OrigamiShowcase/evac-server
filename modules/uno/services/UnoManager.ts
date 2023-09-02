import { CommonService } from "@origamicore/base";
import DbSchemas from "../../common/DbSchemas";
import { GameState } from "../../game/models/GameState";
import UnoCard, { Color, UnoCardType } from "../models/UnoCard";
import UnoGame from "../models/UnoGame";

export default class UnoManager
{
    static games:Map<string,UnoGame>=new Map<string,UnoGame>();
    static userids:Map<string,string>=new Map<string,string>();
    static cards:UnoCard[]=[];
    static createRandomCard():UnoCard[]
    {
        let temp:UnoCard[]=JSON.parse(JSON.stringify(this.cards))
        let cards:UnoCard[]=[]
        while(temp.length)
        {
            let rand= CommonService.random(0,temp.length-1);
            cards.push(...temp.splice(rand,1))
        }
        return cards;
    }
    static createCard()  
    { 
        for(let i=0;i<2;i++)
        {
            for(let color=1;color<5;color++)
            {
                for(let num=0;num<10;num++)
                {
                    this.cards.push(new UnoCard({
                        color,
                        number:num,
                        type:UnoCardType.Normal
                    }))
                }
                this.cards.push(new UnoCard({
                    color,
                    number:-1,
                    type:UnoCardType.Skip
                }))
                this.cards.push(new UnoCard({
                    color,
                    number:-1,
                    type:UnoCardType.Reverse
                }))
                this.cards.push(new UnoCard({
                    color,
                    number:2,
                    type:UnoCardType.Draw
                }))
            }
        }
        for(let i=0;i<4;i++)
        {
            this.cards.push(new UnoCard({
                    color:Color.None,
                    number:0,
                    type:UnoCardType.Wild
                }))
            this.cards.push(new UnoCard({
                color:Color.None,
                number:4,
                type:UnoCardType.WildDraw
            }))
            
        } 
    }
    static async RemoveGame(game:UnoGame)
    {
        await DbSchemas.uno.findByIdAndDelete(game._id);
        for(let player of game.players)
        {
            this.userids.delete(player.userid);
        }
        this.games.delete(game._id)
    }
    static async saveGame(game:UnoGame)
    {
        await DbSchemas.uno.saveById(game);
    }
    static getGame(userid:string):UnoGame
    {
        let gameid=this.userids.get(userid);
        if(!gameid)return ;
        let game= this.games.get(gameid); 
        if(game.players[game.turn].userid!=userid) return ;
        if(game.state!=GameState.Playing)return;
        return game;
    }
    static async start(game:UnoGame)
    {
        if(game.players.length<2) return;
        if(this.games.has(game._id))return;
        this.games.set(game._id,game);
        for(let player of game.players)
            this.userids.set(player.userid,game._id);
        if(game.state==GameState.Waiting)
        {
            game.state=GameState.Playing;
            game.cards=this.createRandomCard();
            for(let player of game.players)
            {
                player.cards=game.cards.splice(0,7)
            }
            game.lossCards.push(...game.cards.splice(0,1))
        }
        //game.timeout=this.getTimeout();
        this.saveGame(game);
        game.sendMessage()
    }
    static nextPlayer(game:UnoGame)
    {
        let next=game.turn
        if(game.clockwise)
        {
            next++;
            if(next>=game.players.length)next=0;
        }
        else
        {
            next--;
            if(next<0)next=game.players.length-1
        }
        return next
    }
    static async select(userid:string,index:number,color:number)
    {
        let game=this.getGame(userid)
        if(!game)return false;
        let player=game.players[game.turn];
        if(index<0 || index>=player.cards.length) return
        let card=player.cards[index];
        if(card.type==UnoCardType.Wild || card.type==UnoCardType.WildDraw)
        {
            if(color<1 || color>4) return
            game.color=color; 
            game.number=-1;
            game.turn=this.nextPlayer(game)
            if(card.type==UnoCardType.WildDraw)
            {
                game.players[game.turn].cards.push(...game.cards.splice(0,4))
                game.turn=this.nextPlayer(game)
            }
        }
        else
        {
            // if(card.type==UnoCardType.Normal)
        }
    }
}