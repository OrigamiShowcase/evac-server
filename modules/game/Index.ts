import { DataInput, EventInput, ModuleConfig, OriInjectable, OriService, PackageIndex, SessionInput } from "@origamicore/core";
import GameConfig from "./models/GameConfig"; 
import DbSchemas from "../common/DbSchemas";
import SessionModel from "../common/models/SessionModel";
import ResponseMessage from "../common/models/response/ResponseMessage";
import GameModel from "./models/GameModel";
import PlayerModel from "./models/PlayerModel";
import { GameState } from "./models/GameState";
import ConnectionManager from "./services/ConnectionManager";
import GameManager from "./services/GameManager";
import Manager from "../common/Manager";
const uuid=require('uuid'); 
@OriInjectable({domain:'game'})
export default class GameService implements PackageIndex
{
    name:string='game';
    config:GameConfig;
    jsonConfig(config: GameConfig): Promise<void> { 
        this.config=config;
        DbSchemas.init(config.dbContext,config.redisContext)
        return ;
    }
    async start(): Promise<void> {
        let games=await DbSchemas.games.search().find();
        for(let game of games.value)
        {
            if(game.state==GameState.Finished)
            {
                await DbSchemas.games.findByIdAndDelete(game._id);
            }
            else if(game.state==GameState.Playing || game.state==GameState.TurnChanging|| game.state==GameState.Puase)
            {
                game.state=GameState.Playing;
                GameManager.start(game)
            }
            
        }
    }
    restart(): Promise<void> {
        return;
    }
    stop(): Promise<void> {
        return;
    }
    
    @OriService({})
    async getGame(@SessionInput session:SessionModel)
    {
        let existGame=await DbSchemas.games.search({where:{'players.userid':session.userid}}).findOne();
        return existGame;
    }
 
    @OriService({})
    async rool(@SessionInput session:SessionModel)
    {
        return await GameManager.rool(session.userid);
    }
    @OriService({})
    async stopTurn(@SessionInput session:SessionModel)
    {
        return await GameManager.stop(session.userid);
    }
    @OriService({})
    async ignore(@SessionInput session:SessionModel)
    {
        return await GameManager.ignore(session.userid);
    }
    @OriService({})
    async select(@SessionInput session:SessionModel,dice0:number,dice1:number)
    {
        return await GameManager.select(session.userid,[dice0,dice1]);
    }
    @OriService({})
    async remove(@SessionInput session:SessionModel,id:string)
    {
        let game=GameManager.games.get(id);
        if(!game)
        {
            throw "not found"
        }
        if(game.players[0].userid!=session.userid)
        {
            console.log(game.players[0].userid,session.userid);
            
            throw 'Access'
        } 
        GameManager.RemoveGame(game)
    }
    @OriService({})
    async startGame(@SessionInput session:SessionModel,id:string)
    {
        let game=await DbSchemas.games.findById(id);
        if(!game || game.players[game.turn].userid!=session.userid || game.state!=GameState.Waiting)
        {
            return;
        }
        return await GameManager.start(game);
    }
    @OriService({})
    async join(@SessionInput session:SessionModel,id:string)
    {
        let existGame=await DbSchemas.games.search({where:{'players.userid':session.userid}}).findOne();
        if(existGame)
        {
            return 
        }
        let game= await DbSchemas.games.findById(id);
        if(!game)
        {
            return
        }
        if(game.state!=GameState.Waiting)
        {
            return
        }
        if(game.players.length>=4)
        {
            return
        }
        game.players.push(new PlayerModel({userid:session.userid}))
        await DbSchemas.games.saveById(game);
        return game;
    }
    @OriService({})
    async createGame(@SessionInput session:SessionModel)
    {
        let existGame=await DbSchemas.games.search({where:{'players.userid':session.userid}}).findOne();
        if(existGame)
        {
            return
        }
        let id=uuid.v4();
        let game=new GameModel({
            _id:id,
            players:[new PlayerModel({userid:session.userid})]
        })
        await DbSchemas.games.saveById(game)
        return game;

    }
    @OriService({isEvent:true})
    async listen(@SessionInput session:SessionModel,@EventInput event:(data:ResponseMessage)=>void)
    {
        Manager.evac.push(session.userid,event);
    }
    @OriService({isInternal:true})
    async closeSession(@SessionInput session:SessionModel)
    {   
        Manager.evac.remove(session.userid);
    }
}