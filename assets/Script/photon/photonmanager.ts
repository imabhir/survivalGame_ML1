import photon from "./photon";

// @ccclass("PhotonManager")
export default class PhotonManager {
  // public instance: PhotonManager;

  private _actorCount: number = 0;

  // public countofactors: any;
  // public prefabs: any;
  // public audioClip: AudioClip;
  // inlobby: boolean;
  private _photon: photon;
  private _roomname: string = "";
  public _gamestarted = false;

  public setupPhoton(photon: photon) {
    this._photon = photon;
  }

  public get Photon() {
    return this._photon;
  }
  //   public set Photon() {}

  onActorJoin() {}

  //   set photon_instance(instance: any) {
  //     this.photon = instance;
  //   }
  //   get photon_instance() {
  //     return this.photon;
  //   }
}
