import { initiativeStateEnum } from "./initiativeStateEnum";
import { userModel } from "./userModel";

export class groupModel {
    //Fields 
    users: userModel[] = [];
    allReady = false;
 
    constructor (){
    }
    addUser(user: userModel)
    {
        this.users.push(user);
        this.allReady = false;
    }
    removeUser(user: userModel)
    {
        const index = this.users.findIndex(x => x.userId = user.userId);
        if(index > -1)
        {
            this.users.splice(index, 1);
        }
    }
    newRound(){
        for (let index = 0; index < this.users.length; index++) {
            this.users[index] = { ...this.users[index], initiative: null, initiativeState: initiativeStateEnum.Not_Set } as userModel;
        }
        this.allReady = false;
    }
    setInitiative(user: userModel, initiative: number | null){
        const index = this.users.findIndex(x => x.userId == user.userId);
        this.users[index] = { ...this.users[index], initiative: initiative, initiativeState: initiative == null ? initiativeStateEnum.Not_Set : initiativeStateEnum.Set } as userModel;
        this.allReady = this.users.every(x => x.initiativeState == initiativeStateEnum.Set);
        if(this.allReady)
        {
            this.orderGroup();
        }
    }
    orderGroup(){
        this.users.sort(function(a, b){return (a.initiative ?? 99) - (b.initiative ?? 99)});
    }
 }