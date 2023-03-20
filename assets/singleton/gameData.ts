import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameData')
export class gameData {
    private static _instance: gameData = null;
    private modeIndex: gameData = null;
    private targetMapNode: Node = null;
    private gameData(){

    }

    /**
     * 
     * @returns instance of the class
     */
    public static getInstance(){
        if(!gameData._instance){
            gameData._instance = new gameData()
        }
        return gameData._instance
    }

    /**
     * 
     * @param index It is the index of the mode as defined in enum
     */
    initMode(index){
        this.modeIndex = index;
    }

    /**
     * 
     * @returns the mode index which is used in deciding the number of players as per the mode
     */
    getModeOnSelect(){
        return this.modeIndex
    }

    
    // initMapWithMaxVotes(targetMapNode: Node){
    //     this.targetMapNode = targetMapNode
    //     console.log("Map initialized", this.targetMapNode);
    // }

    // getMapWithMaxVotes(): Node{
    //     return this.targetMapNode
    // }
}

