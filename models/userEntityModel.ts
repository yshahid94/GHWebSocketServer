import { ServerWebSocket } from "bun";
import { entityModel } from "./entityModel";
import { entityTypeEnum } from "./entityTypeEnum";

export class userModel extends entityModel {
   //Fields 
   initiative: { init1: number | null, init2: number | null } = { init1: null, init2: null };
   // initiativeState = initiativeStateEnum.Not_Set;
   webSocket: ServerWebSocket<{ user: userModel }> | null = null;
   admin: boolean = false;

   constructor(name: string, active = false, admin = false) {
      super(name, entityTypeEnum.User);
      this.admin = admin;
   }

   disconnectUser() {
      if (this.webSocket != null && this.webSocket.readyState == 1) {
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