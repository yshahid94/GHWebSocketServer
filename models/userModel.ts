import { randomUUID } from "crypto";
import { initiativeStateEnum } from "./initiativeStateEnum";

export class userModel {
   //Fields 
   username: string
   userId: string
   initiative: number | null
   initiativeState = initiativeStateEnum.Not_Set;

   constructor (username: string){
      this.username = username;
      this.userId  = randomUUID();
      this.initiative = null;
   }
}