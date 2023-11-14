import { STCMessageTypeEnum } from "./MessageModels/STCMessageTypeEnum";
import { STCRequestMessageModel } from "./MessageModels/STCRequestMessageModel";
import { entityModel } from "./entityModel";
import { entityTypeEnum } from "./entityTypeEnum";
import { monsterEntityModel } from "./monsterEntityModel";
import { userModel } from "./userEntityModel";

export class groupModel {
    //Fields 
    private entities: entityModel[] = [];
    showInitiative = false;
 
    constructor (){
    }
    
    addEntity(entity: entityModel)
    {
        //if user is first set to active and admin
        if(entity instanceof userModel){
            if(this.entities.length == 0){
                entity.admin = true;
            }
            const msgModel = new STCRequestMessageModel(STCMessageTypeEnum.User_Data, entity.id);
            entity.webSocket?.send(JSON.stringify(msgModel));
        }
        this.entities.push(entity);
        
        if(this.allInitiativesSet()){
            this.newRound();
        }
    }
    removeEntity(user: entityModel)
    {
        const index = this.entities.findIndex(x => x.id == user.id);
        if(index > -1)
        {
            this.entities.splice(index, 1);
        }
        this.newRound();
    }
    newRound(){
        //this might not work
        this.entities.forEach((entity) =>{
            entity.resetEntity();
        });
        this.showInitiative = false;
    }
    setInitiative(entity: entityModel, initiative: { init1: number | null, init2: number | null } | number | null){
        const index = this.entities.findIndex(x => x.id == entity.id);
        if(entity.entityType == entityTypeEnum.User){
            (this.entities[index] as userModel).initiative = (initiative as { init1: number | null, init2: number | null });
        }
        else if(entity.entityType == entityTypeEnum.Monster){            
            (this.entities[index] as monsterEntityModel).initiative = (initiative as number | null);
        }
        
        if(this.allInitiativesSet()){
            this.sortAndActivateFirst();
        }
    }
    nextTurn(){
        //move active to next user in the queue
        let activeEntityFound = false;
        for (let index = 0; index < this.entities.length; index++) {
            const indexEntity = this.entities[index];
            if(activeEntityFound){
                this.entities[index].currentlyActive = true;
                return;
            }
            activeEntityFound = indexEntity.currentlyActive;
            if(indexEntity.currentlyActive){
                this.entities[index].currentlyActive = false;
            }
        }
    }
    resetGroup(sourceUser: userModel){
        //disconnect all others before disconnecting yourself
        this.entities.filter(x => x.id != sourceUser.id && x instanceof userModel).forEach((entity) => {
            (entity as userModel).disconnectUser();
        });
        sourceUser.disconnectUser();
    }
    allInitiativesSet(){
        return this.entities.every(x => x.isInitiativeSet());
    }

    sortAndActivateFirst(){
        this.entities = this.entities.sort(function(a, b){
            return a.initiativeCombined() - b.initiativeCombined();
        });
        this.entities[0].currentlyActive = true;
    }
 }