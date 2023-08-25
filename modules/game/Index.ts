import { DataInput, EventInput, ModuleConfig, OriInjectable, OriService, PackageIndex, SessionInput } from "@origamicore/core";
import GameConfig from "./models/GameConfig"; 
import DbSchemas from "../common/DbSchemas";
import SessionModel from "../common/models/SessionModel";
import ResponseMessage from "../common/models/response/ResponseMessage";
import GameModel from "./models/GameModel";
import PlayerModel from "./models/PlayerModel";
import { GameState } from "./models/GameState";
import ConnectionManager from "./services/ConnectionManager";
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
    start(): Promise<void> {
        return;
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
    async startGame(@SessionInput session:SessionModel)
    {

    }
    @OriService({})
    async Join(@SessionInput session:SessionModel,id:string)
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
        return game._id;
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
        await DbSchemas.games.saveById(new GameModel({
            _id:id,
            players:[new PlayerModel({userid:session.userid})]
        }))
        return id;

    }
    @OriService({isEvent:true})
    async listen(@SessionInput session:SessionModel,@EventInput event:(data:ResponseMessage)=>void)
    {
        ConnectionManager.push(session.userid,event);
    }
    @OriService({isInternal:true})
    async closeSession(@SessionInput session:SessionModel)
    {   
        ConnectionManager.remove(session.userid);
    }
}