import { entityTypeEnum } from "./entityTypeEnum";

export class entityModel {
   name: string;
   id: string;
   currentlyActive: boolean = false;
   entityType: entityTypeEnum;

   constructor (name: string, entityType: entityTypeEnum, id: string){
      this.name = name;
      this.id = id;
      this.entityType = entityType;
   }
   resetEntity(){
      this.currentlyActive = false;
   }
   initiativeCombined(){
      return 9999;
   }
   isInitiativeSet(){
      return false;
   }
}