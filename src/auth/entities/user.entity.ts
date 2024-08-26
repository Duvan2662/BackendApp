import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

    _id?:string; //Mongo lo hace por mi

    @Prop({unique:true, required:true})
    name:string;

    @Prop({required:true})
    email:string;

    @Prop({minlength:6, required:true})
    password?:string;

    @Prop({default:true})
    isActive:string;

    @Prop({type:[String], default:['user']}) //[['user','Admin', ....]
    roles:string[];
}




export const UserSchema = SchemaFactory.createForClass(User);
