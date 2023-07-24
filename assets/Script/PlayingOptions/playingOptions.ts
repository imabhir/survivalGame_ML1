import {
  _decorator,
  Component,
  Node,
  instantiate,
  Input,
  Canvas,
  Prefab,
  ScrollView,
  EventHandler,
  Button,
  director,
  Sprite,
  tween,
  log,
  Label,
  Mask,
} from "cc";
import { audioManager } from "../audio/scripts/audioManager";
import { photonmanager } from "../../Script/photon/photonmanager";
// import { audioManager } from '../../audio/scripts/audioManager';
import { resourceManager } from "../singleton/resourceManager";
import { AvailableRooms } from "./AvailableRooms";
import { modes } from "../Modes/modes";
import { RoomCreation } from "./RoomCreation";
import { PopupManager } from "../PopUpHandler/PopupManager";
import { POPUPS } from "../constants/Popup";
const { ccclass, property } = _decorator;

@ccclass("playingOptions")
export class playingOptions extends Component {
  @property({ type: Prefab })
  ScrollRooms: Prefab = null;

  @property({ type: Node })
  JoinRoom: Node = null;

  @property({ type: Node })
  CreateRoom: Node = null;

  @property({ type: Node })
  quickplay: Node = null;
  @property({ type: Prefab })
  RoomDetails: Prefab = null;

  @property({ type: Prefab })
  playerLobbyPrefab: Prefab = null;
  resourceInstance = resourceManager.getInstance();
  audioInstance = audioManager.getInstance();
  photon_instance: any;
  playerLobby: Node = null;
  newFlag: string = "";
  onLoad() {
    console.log("on load call ");
    this.showMode();
    this.applyMusic();

    this.photon_instance = photonmanager.Instance.photon_instance;
    this.playerLobby = instantiate(this.playerLobbyPrefab);
    this.node.addChild(this.playerLobby);
    this.playerLobby.active = false;

    this.JoinRoom.on(Input.EventType.TOUCH_START, () => {
      const ScrollRoom = instantiate(this.ScrollRooms);
      this.node.addChild(ScrollRoom);
      ScrollRoom.getComponent(AvailableRooms).LoadRoom(this.photon_instance.availableRooms(), this.playerLobby);
    });

    this.CreateRoom.on(Input.EventType.TOUCH_START, () => {
      const RoomDetail = instantiate(this.RoomDetails);
      RoomDetail.getComponent(RoomCreation).getPlayerLobby(this.playerLobby);
      let event = new EventHandler();
      // This node is the node to which your event handler code component belongs
      event.target = RoomDetail;
      // This is the script class name
      event.component = "RoomCreation";
      event.handler = "createroom";

      const button = RoomDetail.getChildByName("Button").getComponent(Button);
      button.clickEvents.push(event);
      this.node.addChild(RoomDetail);
    });
  }
  showMode() {
    console.log("show mode function call ");

    let array = ["CREATE ROOM", "QUICK PLAY", "JOIN ROOM"];
    let check1 = {};
    let check2 = {};
    let check3 = {};
    tween(this.CreateRoom)
      .to(
        2,
        { angle: 30 },
        {
          progress: (start, end, current, ratio) => {
            this.CreateRoom.getComponent(Sprite).fillRange = ratio;
            this.quickplay.getComponent(Sprite).fillRange = ratio;
            this.JoinRoom.getComponent(Sprite).fillRange = ratio;
            // this.CreateRoom.parent.getComponent(Mask).alphaThreshold = 1 - ratio
            // this.quickplay.parent.getComponent(Mask).alphaThreshold = 1 - ratio
            // this.JoinRoom.parent.getComponent(Mask).alphaThreshold = 1 - ratio
            if (
              this.CreateRoom.children[0].getComponent(Label).string.length != array[0].length &&
              check1[Math.round(ratio * 10)] != Math.round(ratio * 10)
            ) {
              this.CreateRoom.children[0].getComponent(Label).string += array[0][Math.round(ratio * 10)];
              check1[Math.round(ratio * 10)] = Math.round(ratio * 10);
            }
            if (
              this.quickplay.children[0].getComponent(Label).string.length != array[1].length &&
              check2[Math.round(ratio * 10)] != Math.round(ratio * 10)
            ) {
              this.quickplay.children[0].getComponent(Label).string += array[1][Math.round(ratio * 10)];
              check2[Math.round(ratio * 10)] = Math.round(ratio * 10);
            }
            if (
              this.JoinRoom.children[0].getComponent(Label).string.length != array[2].length &&
              check3[Math.round(ratio * 10)] != Math.round(ratio * 10)
            ) {
              this.JoinRoom.children[0].getComponent(Label).string += array[2][Math.round(ratio * 10)];
              check3[Math.round(ratio * 10)] = Math.round(ratio * 10);
              console.log("logged", current, start, end, ratio);
            }

            return 0;
          },
        }
      )
      .call(() => {
        console.log("logged");
      })
      .start();
  }
  quickjoin() {
    // director.loadScene("playersLobby", this.callback);
    this.playerLobby.active = true;
    this.callback();
  }
  callback() {
    let photon_instance = photonmanager.Instance.photon_instance;
    if (photon_instance.isInLobby()) {
      photon_instance.joinRandomOrCreateRoom({ expectedMaxPlayers: 5, expectedisOpen: true }, undefined, {
        emptyRoomLiveTime: 20000,
        maxPlayers: 5,
      });
    }
  }

  applyMusic = () => {
    // this.scheduleOnce(() => {
    const music = instantiate(this.resourceInstance.GetPrefab("Music"));
    this.node.addChild(music);
    // }, 1)

    // this.scheduleOnce(() => {
    const clip = this.resourceInstance.getMusicFile("audio1");
    this.audioInstance.playMusicClip(clip, true);
    // }, 1)
  };

  AddSettings() {
    this.newFlag = "Immediately open";
    PopupManager.show(POPUPS.SETTINGS, this.newFlag);
  }
  AddAccountButton() {
    this.newFlag = "Immediately open";
    PopupManager.show(POPUPS.ACCOUNT, this.newFlag);
  }
  backToModeSelection() {
    this.node.parent.getComponent(modes).backFromRoomSelection();
    this.node.parent.active = true;
    this.node.active = false;
  }

  start() {}

  update(deltaTime: number) {}
}
