import { ServerWebSocket } from "bun";
import { entityModel } from "./entityModel";
import { entityTypeEnum } from "./entityTypeEnum";
import { STCRequestMessageModel } from "./MessageModels/STCRequestMessageModel";
import { STCMessageTypeEnum } from "./MessageModels/STCMessageTypeEnum";

export class userModel extends entityModel {
   //Fields 
   initiative: { init1: number | null, init2: number | null } = { init1: null, init2: null };
   // initiativeState = initiativeStateEnum.Not_Set;
   webSocket: ServerWebSocket<{ user: userModel }> | null = null;
   admin: boolean = false;
   deviceId: string;

   constructor(name: string, id: string, active = false, admin = false) {
      super(name, entityTypeEnum.User, id);
      this.admin = admin;
      this.deviceId = id;
   }

   disconnectUser() {
      if (this.webSocket != null && this.webSocket.readyState == 1) {
         this.webSocket.send(new STCRequestMessageModel(STCMessageTypeEnum.Kill_Client, null).asJsonString())
         this.webSocket.close();
      }
   }
   resetEntity(){
      super.resetEntity();
      this.initiative = { init1: null, init2: null };
   }
   initiativeCombined(){
      return Number.parseInt(`${(this.initiative.init1 ?? 99).toString()}${(this.initiative.init2 ?? 99).toString()}`);
   }
   isInitiativeSet(){
      return this.initiative.init1 && this.initiative.init2 ? true : false;
   }
}