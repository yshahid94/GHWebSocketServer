import type { STCMessageTypeEnum } from "./STCMessageTypeEnum";

export class STCRequestMessageModel {
   //Fields 
   messageType: STCMessageTypeEnum
   message: any

   constructor (messageType: STCMessageTypeEnum, message: any){
      this.messageType = messageType;
      this.message = message;
   }

   asJsonString(){
      return JSON.stringify(this);
   }
}