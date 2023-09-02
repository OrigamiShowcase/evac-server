export default class UnoCard
{
    color:Color;
    type:UnoCardType;
    number:number
    constructor(data:{
        color:Color;
        type:UnoCardType;
        number:number
    })
    {
        Object.assign(this,data);
    }
}
export enum Color
{
    None=0,
    Red=1,
    Yellow=2,
    Green=3,
    Blue=4
}
export enum UnoCardType
{
    Normal=1,
    Draw=2,
    Reverse=3,
    Skip=4,
    Wild=5,
    WildDraw=6
}