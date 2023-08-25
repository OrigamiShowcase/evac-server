export default class ProfileModel
{
    _id:string;
    name:string;
    picture:string;
    constructor(data:{
        _id:string;
        name:string;
        picture:string;
    })
    {
        Object.assign(this,data);
    }
}