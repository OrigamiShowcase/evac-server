import IndexValueModel from "./IndexValueModel";

export default class PlayerModel
{
    userid:string;
    meeples:IndexValueModel[]=[];
    ships:IndexValueModel[]=[];
    winIndex:number[];
    constructor(data:any)
    {
        Object.assign(this,data);
    }
}