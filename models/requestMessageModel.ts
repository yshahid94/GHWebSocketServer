import { AnyMxRecord } from "dns";
import { messageTypeEnum } from "./messageTypeEnum";
import { userModel } from "./userModel";

export class requestMessageModel {
   //Fields 
   messageType: messageTypeEnum
   message: any

   constructor (messageType: messageTypeEnum, message: any){
      this.messageType = messageType;
      this.message = message;
   }
}