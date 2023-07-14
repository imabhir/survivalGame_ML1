import { _decorator, Component, log, Node } from 'cc';
import { photonmanager } from '../photon/photonmanager';
const { ccclass, property } = _decorator;

@ccclass('gameData')
export class gameData {
    private static _instance: gameData = null;
    private modeIndex: gameData = null;
    private targetMapNode: Node = null;
    private SaveUser: string = "";
    // private UserName: string = "";
    private gameData() {

    }

    /**
     * 
     * @returns instance of the class
     */
    public static getInstance() {
        if (!gameData._instance) {
            gameData._instance = new gameData()
        }
        return gameData._instance
    }

    /**
     * 
     * @param index It is the index of the mode as defined in enum
     */
    initMode(index) {
        this.modeIndex = index;
    }

    /**
     * 
     * @returns the mode index which is used in deciding the number of players as per the mode
     */
    getModeOnSelect() {
        return this.modeIndex
    }

    initMapWithMaxVotes(targetMapWithMaxVotes) {
        // console.log("Got map", targetMapWithMaxVotes);
        console.log(targetMapWithMaxVotes);
        photonmanager.getInstance().photon_instance.maps[targetMapWithMaxVotes.name] = photonmanager.getInstance().photon_instance.maps[targetMapWithMaxVotes.name] + 1;
        photonmanager.getInstance().photon_instance.raiseEvent(2000, { name: targetMapWithMaxVotes.name })
        this.targetMapNode = targetMapWithMaxVotes

    }

    getMapWithMaxVotes() {




        return this.targetMapNode
    }

    // SetUserName(UserName){
    //     this.UserName = UserName
    // }

    // GetUserName(){
    //     return this.UserName
    // }

    SetSaveUserName(UserName) {
        this.SaveUser = UserName
    }

    GetSaveUserName() {
        return this.SaveUser
    }
}

