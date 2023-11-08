import type { CTSMessageTypeEnum } from "./CTSMessageTypeEnum";

export class CTSRequestMessageModel {
   //Fields 
   messageType: CTSMessageTypeEnum
   message: any

   constructor (messageType: CTSMessageTypeEnum, message: any){
      this.messageType = messageType;
      this.message = message;
   }
}