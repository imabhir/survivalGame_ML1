import { _decorator, AudioClip } from "cc";
const { ccclass, property } = _decorator;

@ccclass("photonmanager")
export class photonmanager {
  // private countofactors: any;
  // private prefabs: any;
  // private audioClip: AudioClip;
  // private inlobby: boolean;
  // private roomname;
  private photon: any;
  private gamestarted: boolean = false;
  private playerScriptRef: any = null;
  private wallCollisionRef: any = null;
  private static _instance: photonmanager;
  private constructor() {}

  static get Instance(): photonmanager {
    if (!photonmanager._instance) {
      photonmanager._instance = new photonmanager();
    }
    return this._instance;
  }

  set photon_instance(instance: any) {
    this.photon = instance;
  }
  get photon_instance() {
    return this.photon;
  }

  set GameStartStatus(gamestarted: boolean) {
    this.gamestarted = gamestarted;
  }
  get GameStartStatus(): boolean {
    return this.gamestarted;
  }
  set PhotonRef(photon: any) {
    this.photon = photon;
  }
  get PhotonRef(): any {
    return this.photon;
  }
  set PlayerScriptRef(playerScriptRef: any) {
    this.playerScriptRef = playerScriptRef;
  }
  get PlayerScriptRef(): any {
    return this.playerScriptRef;
  }

  set WallCollisionRef(wallCollisionRef: any) {
    this.wallCollisionRef = wallCollisionRef;
  }
  get WallCollisionRef(): any {
    return this.wallCollisionRef;
  }
}
