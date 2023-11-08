import { entityModel } from "./entityModel";
import { entityTypeEnum } from "./entityTypeEnum";

export class monsterEntityModel extends entityModel {
   //Fields 
   initiative: number | null = null;

   constructor(name: string) {
      super(name, entityTypeEnum.Monster);
   }
   
   resetEntity(){
      super.resetEntity();
      this.initiative = null;
   }
   initiativeCombined(){
      return Number.parseInt(`${(this.initiative ?? 99).toString()}99`);
   }
   isInitiativeSet(){
      return this.initiative ? true : false;
   }
}