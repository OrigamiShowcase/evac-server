import { CommonService } from "@origamicore/base";
import GameModel from "../models/GameModel";
import DbSchemas from "../../common/DbSchemas";
import ResponseMessage from "../../common/models/response/ResponseMessage";
import ConnectionManager from "./ConnectionManager";
import { GameState } from "../models/GameState";
import { ResponseType } from "../../common/models/response/ResponseType"; 
import IndexValueModel from "../models/IndexValueModel";

export default class GameManager
{
    static board:Map<number,number>=new Map<number,number>([
        [2,3],
        [3,5],
        [4,7],
        [5,9],
        [6,11],
        [7,13],
        [8,11],
        [9,9],
        [10,7],
        [11,5],
        [12,3] 
    ]);
    static games:Map<string,GameModel>=new Map<string,GameModel>();
    static userids:Map<string,string>=new Map<string,string>();
    static async RemoveGame(game:GameModel)
    {
        await DbSchemas.games.findByIdAndDelete(game._id);
        for(let player of game.players)
        {
            this.userids.delete(player.userid);
        }
        this.games.delete(game._id)
    }
    static async saveGame(game:GameModel)
    {
        await DbSchemas.games.saveById(game);
    }
    static getTimeout()
    {
        return new Date().getTime()+1000*60;
    }
    static getGame(userid:string):GameModel
    {
        let gameid=this.userids.get(userid);
        if(!gameid)return ;
        let game= this.games.get(gameid); 
        if(game.players[game.turn].userid!=userid) return ;
        if(game.state!=GameState.Playing)return
        return game;
    }
    static async start(game:GameModel)
    {
        if(this.games.has(game._id))return
        this.games.set(game._id,game);
        for(let player of game.players)
            this.userids.set(player.userid,game._id);
        if(game.state==GameState.Waiting)
        {
            game.state=GameState.Playing;
        }
        game.timeout=this.getTimeout();
        this.saveGame(game);
        game.sendMessage(ResponseType.Start)
    }
    static async rool(userid:string)
    { 
        let game=this.getGame(userid)
        if(!game)return false;
        if(game.dices.length>0)return false;
        for(let i=0;i<4;i++)
        {
            game.dices.push(CommonService.random(1,6)) 
        }
        let palyer=game.players[game.turn];
        if(palyer.meeples.length>=3)
        {
            let canplay=false;
            for(let i=0;i<4;i++)
            {
                for(let j=0;j<4;j++)
                {
                    if(i!=j)
                    {
                        let sum= game.dices[i]+game.dices[j];
                        if(palyer.meeples.filter(p=>p.index==sum)[0])
                        {
                            if(!game.locks || game.locks.indexOf(sum)==-1)
                            {
                                canplay=true
                            }
                        }
                    }
                }
            }
            if(!canplay)
            {
                game.state=GameState.TurnChanging;
                setTimeout(()=>{
                    game.players[game.turn].meeples=[]
                    game.turn++;
                    if(game.turn>=game.players.length)game.turn=0;
                    game.dices=[]
                    this.saveGame(game);
                    game.sendMessage(ResponseType.Turn)
                    game.state=GameState.Playing;
                },5000)
            }
        }
        this.saveGame(game);
        game.sendMessage(ResponseType.Rool)
    }
    static async stop(userid:string)
    {
        let game=this.getGame(userid)
        if(!game)return false;
        if(game.dices.length>2)return false;
        game.state=GameState.TurnChanging;
        game.dices=[]
        for(let meeple of game.players[game.turn].meeples)
        {
            let ships=game.players[game.turn].ships;
            let shipIndex=ships.findIndex(p=>p.index==meeple.index);
            if(shipIndex>-1)
            {
                ships[shipIndex].value=meeple.value
            }
            else
            {
                ships.push(new IndexValueModel({index:meeple.index,value:meeple.value}));
            }
            if(this.board.get(meeple.index)==meeple.value)
            {
                game.locks.push(meeple.index);
                game.players[game.turn].winIndex??=[]
                game.players[game.turn].winIndex.push(meeple.index)
                if(game.players[game.turn].winIndex.length>=3)
                {
                    game.state=GameState.Finished;
                    this.saveGame(game);
                    game.sendMessage(ResponseType.Finished)
                    setTimeout(()=>{
                        this.RemoveGame(game)
                    },1000*60)
                    return
                }
            }
        }
        game.players[game.turn].meeples=[]
        game.turn++;
        if(game.turn>=game.players.length)game.turn=0;
        game.state=GameState.Playing;
        this.saveGame(game);
        game.sendMessage(ResponseType.Turn)
    }
    static async ignore(userid:string)
    {
        let game=this.getGame(userid)
        if(!game)return false;
        if(game.dices.length!=2)return false;
        if(game.players[game.turn].meeples.length<3)return false;
        game.dices=[]
        game.timeout=this.getTimeout();
        this.saveGame(game);
        game.sendMessage(ResponseType.Ignore)
    }
    static async select(userid:string,dices:number[])
    {
        let game=this.getGame(userid)
        if(!game)return false;
        if(game.dices.length==0)return false;
        if(dices.length!=2 || !game.dices[dices[0]] || !game.dices[dices[1]] || dices[0]==dices[1]) return false;
        let sum =game.dices[dices[0]]+game.dices[dices[1]];
        if(game.locks.indexOf(sum)>-1)
        {
            return false;
        }
        let meeples = game.players[game.turn].meeples;
        let index=meeples.findIndex(p=>p.index==sum); 
        if(meeples.length>=3)
        {
            if(index==-1)return;
            let test=this.board.get(sum)
            if(this.board.get(sum)< meeples[index].value+1)
            {
                return;
            }
            meeples[index].value++; 
        }
        else
        {
            if(index>-1)
            {
                if(this.board.get(sum)< meeples[index].value+1)
                {
                    return;
                }
                meeples[index].value++; 
            }
            else
            { 
                let existShip=game.players[game.turn].ships.filter(p=>p.index==sum)[0];
                if(existShip )
                {
                    meeples.push(new IndexValueModel({index:sum,value:existShip.value+1})) 
                }
                else
                {
                    meeples.push(new IndexValueModel({index:sum,value:1}))
                }
            }
        }
        let max=Math.max(dices[0],dices[1])
        let min=Math.min(dices[0],dices[1])
        game.dices.splice(max,1) 
        game.dices.splice(min,1) 
        game.timeout=this.getTimeout();
        this.saveGame(game);
        game.sendMessage(ResponseType.Select)
    }
}