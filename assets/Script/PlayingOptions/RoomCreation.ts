import { _decorator, Component, Node, EditBox, log, director } from "cc";
// import { PhotonManager } from "../../Script/photon/photonmanager";

import photon from "../photon/photon";
import { MultiplayerManager } from "../photon/MultiplayerManager";

const { ccclass, property } = _decorator;

@ccclass("RoomCreation")
export class RoomCreation extends Component {
  @property({ type: EditBox })
  RoomName: EditBox = null;
  photon: MultiplayerManager = null;
  onLoad() {
    let object = new photon();
    this.photon = new MultiplayerManager();
    this.photon.setupPhoton(object);
    this.photon.startConnection();
  }

  CloseCreateRoom() {
    setTimeout(() => {
      this.node.destroy();
    });
  }
  createroom() {
    console.log(this.RoomName.getComponent(EditBox).string);
    // this.photon_instance.roomname = this.RoomName.getComponent(EditBox).string;
    director.loadScene("playersLobby", this.callback);
  }
  callback() {
    // let photon_instance = PhotonManager.Instance.Photon;
    // if (photon_instance.isInLobby()) {
    //   console.log(photon_instance.roomname);
    //   photon_instance.createRoom(photon_instance.roomname);
    // }
  }
  start() {}

  update(deltaTime: number) {}
}
