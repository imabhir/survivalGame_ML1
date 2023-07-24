import { _decorator, Component, log, Node } from "cc";
import { photonmanager } from "../photon/photonmanager";
const { ccclass, property } = _decorator;

@ccclass("gameData")
export class gameData {
  private static _instance: gameData = null;
  private modeIndex: gameData = null;
  private targetMapNode: Node = null;
  private SaveUser: string = "";
  /**
   *
   * @returns instance of the class
   */
  public static getInstance() {
    if (!gameData._instance) {
      gameData._instance = new gameData();
    }
    return gameData._instance;
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
    return this.modeIndex;
  }

  initMapWithMaxVotes(targetMapWithMaxVotes) {
    // console.log("Got map", targetMapWithMaxVotes);
    console.log(targetMapWithMaxVotes);

    // if (this.object[event.target.name] > 0) {
    //   console.log("Map Inc", this.object[event.target.name]);
    // } else {
    photonmanager.Instance.photon_instance.maps[targetMapWithMaxVotes.name] += 1;
    //   this.object[event.target.name] = 1;
    let selectedObj = photonmanager.Instance.photon_instance.maps[targetMapWithMaxVotes.name];
    // for (const key in photonmanager.getInstance().photon_instance.maps) {
    //   //   // console.log("Check Method in Map.ts", this.object[key]);
    //   if (photonmanager.getInstance().photon_instance.maps[key] == selectedObj) {
    //   } else {
    //     if (photonmanager.getInstance().photon_instance.maps[key] > 0) {
    //       photonmanager.getInstance().photon_instance.maps[key] -= 1;
    //       //   photonmanager.getInstance().photon_instance.maps[targetMapWithMaxVotes.name] -= 1;
    //     }
    //     // photonmanager.getInstance().photon_instance.maps[targetMapWithMaxVotes.name] = 0;
    //   }
    //   //   }
    // }

    photonmanager.Instance.photon_instance.raiseEvent(2000, { name: targetMapWithMaxVotes.name });
    this.targetMapNode = targetMapWithMaxVotes;
  }
  setmapWithMaxVotes(targetMapNode: Node) {
    this.targetMapNode = targetMapNode;
  }
  getMapWithMaxVotes(): Node {
    return this.targetMapNode;
  }

  SetSaveUserName(UserName: string) {
    this.SaveUser = UserName;
  }

  GetSaveUserName(): string {
    return this.SaveUser;
  }
}
