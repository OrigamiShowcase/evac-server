export default class IndexValueModel
{
    index:number;
    value:number;
    constructor(data:{
        index:number;
        value:number;
    })
    {
        Object.assign(this,data)
    }
}