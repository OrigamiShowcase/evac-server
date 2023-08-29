import { IOriModel, OriModel, OriProps } from "@origamicore/core";
@OriModel()
export default class ProfileModel extends IOriModel
{
    _id:string;
    @OriProps({  title:'Username',minLength:4,maxLength:20})
    username:string;
    @OriProps({isRequired:true, title:'First Name',minLength:4,maxLength:20})
    firstName:string;
    @OriProps({isRequired:true, title:'Last Name',minLength:4,maxLength:20})
    lastName:string;
    avatar:string;
    status:number;
    email:string;
    constructor(data:{ 
        _id:string;
        username:string;
        firstName:string;
        lastName:string;
        avatar:string;
        status:number;
        email:string;
    })
    {
        super()
        Object.assign(this,data)
    }
}