import { PlayerMovement } from "../Player/PlayerMovement";
import config, { Photonevents } from "./cloud-app-info";
import { photonmanager } from "./photonmanager";
import { Color, director, log } from "cc";
import { playerslobby } from "../playersLobby/players";
import { Message } from "../ChatScript/Message";
import { walls } from "../wallscollisions";
var photonWss = config && config.Wss;
var photonAppId = config && config.AppId ? config.AppId : "a36f3ed3-e604-4772-9b98-985d37c5f6ac";
var photonAppVersion = config && config.AppVersion ? config.AppVersion : "1.0";
var photonMasterServer = config && config.MasterServer;
var photonNameServer = config && config.NameServer;
var photonRegion = config && config.Region;
var DemoFbAppId = config && config.FbAppId;

/**
 *@class extension of photon class
 *@usage an object of this class can be made inside the same script within or outside any class
 **/
export default class photon extends Photon.LoadBalancing.LoadBalancingClient {
  logger = new Exitgames.Common.Logger("Zombieamongus:");
  checker: number = 1;
  player_movement: PlayerMovement;
  player_lobby: playerslobby;
  ConnectOnStart: boolean = true;
  message: Message = null;
  wall: walls = null;
  totalmessages: any = [];
  joined: boolean = false;
  maps = { map0: 0, map1: 0, map2: 0, map3: 0 };

  constructor() {
    super(photonWss ? 1 : 0, photonAppId, photonAppVersion);
    this.logger.info("Photon Version: " + Photon.Version + (Photon.IsEmscriptenBuild ? "-em" : ""));
    this.logger.info("Init", this.getNameServerAddress(), photonAppId, photonAppVersion);
    this.setLogLevel(Exitgames.Common.Logger.Level.INFO);
  }

  set player_movements(value: PlayerMovement) {
    this.player_movement = value;
  }
  set player_lobbys(value: playerslobby) {
    this.player_lobby = value;
  }
  set messages(value: Message) {
    this.message = value;
  }
  set wallclass(value: walls) {
    this.wall = value;
  }
  // onLoad() {
  //   photonmanager.Instance.photon_instance = this;
  // }
  start() {
    if (this.ConnectOnStart) {
      if (photonMasterServer) {
        this.setMasterServerAddress(photonMasterServer);
        this.connect();
      }
      if (photonNameServer) {
        this.setNameServerAddress(photonNameServer);
        this.connectToRegionMaster(photonRegion || "in");
      } else {
        this.connectToRegionMaster(photonRegion || "in");
      }
    }
  }

  onJoinRoom(createdByMe: boolean): void {}
  onActorJoin(actor: Photon.LoadBalancing.Actor): void {
    if (!photonmanager.Instance.PhotonRef.joined) this.player_lobby.addplayerinlobby();
    if (this.joined) {
      this.player_movement.addedactor(actor);
    }
  }

  onEvent(Event: number, content: any, actorNr: number): void {
    if (Event == Photonevents.Startgame) {
      this.joined = true;
      if (!photonmanager.Instance.GameStartStatus)
        director.loadScene("gameplay", () => {
          photonmanager.Instance.PhotonRef.myRoom().isOpen = false;
          photonmanager.Instance.GameStartStatus = true;
          this.myRoom().setIsOpen(false);
          this.myRoom().setIsVisible(false);
          photonmanager.Instance.PhotonRef.CloseAvailableRoom;
          photonmanager.Instance.PhotonRef.joined = true;
          photonmanager.Instance.GameStartStatus = true;
          photonmanager.Instance.PhotonRef.raiseEvent(Photonevents.Startgame, {}, {});
        });
    } else if (Event == Photonevents.Killotheractor) {
      this.player_movement.kill_otheractor(null, content);
    } else if (Event == Photonevents.Killotheractors) {
      this.player_movement.kill_otheractor(null, content);
    } else if (Event == Photonevents.Setroomproperties) {
    } else if (Photonevents.Openchest == Event) {
      if (this.wall != null) this.wall.openchest(actorNr);
    } else if (Photonevents.Ghostchat == Event) {
      if (this.message != null) {
        this.message.recievedmessage(content.ReqMessage, content.color);
      } else {
        this.totalmessages.push({ reqMessage: content.ReqMessage, color: content.color });
      }
    } else if (this.joined && Event == Photonevents.Animation && photonmanager.Instance.GameStartStatus) {
      console.log("enable");
      if (this.player_movement != null) this.player_movement.enableanimation(actorNr, content);
    } else if (Event == Photonevents.Fireatotheractors) {
      if (this.wall != null) {
        this.wall.fireatotheractor({ ...content, actorNr: actorNr.toString() });
      }
    } else if (Event == Photonevents.Killactor) {
      if (this.wall != null) {
        this.wall.kill_actor(content);
      }
    } else if (Event == Photonevents.Move) {
      if (this.joined && photonmanager.Instance.GameStartStatus)
        if (this.player_movement != null) this.player_movement.move_actor(content);
    } else if (Event == Photonevents.Zombieotheractor) {
      console.log("killed");

      this.player_movement.zombie_otheractor(null, content);
    } else if (Event == Photonevents.Zombieactor) {
      console.log("killed");

      this.wall.zombie_actor(content);
    } else if ((Event = 2000)) {
      //   this.maps[content.name] = this.maps[content.name] + 1;

      //   console.log(content.name);

      this.maps[content.name] += 1;
      //   this.object[event.target.name] = 1;
      //   let selectedObj = this.maps[content.name];
      //   for (const key in this.maps) {
      // console.log("Check Method in Map.ts", this.object[key]);
      // console.log("Content Name", this.maps[content.name]);
      // console.log("Selected obj name", selectedObj);
      // if (this.maps[key] == selectedObj) {
      // } else {
      //   if (this.maps[key] > 0) {
      //     this.maps[key] -= 1;
      //   }
      // }
      //   }
      //   }

      let max = 0;
      let maxKey = "";

      for (let char in this.maps) {
        console.log(char);

        if (this.maps[char] >= max) {
          max = this.maps[char];
          maxKey = char;
        }
      }

      console.log(maxKey, this.maps);
    }
  }
  onActorPropertiesChange(actor: Photon.LoadBalancing.Actor): void {}

  onActorLeave(actor: Photon.LoadBalancing.Actor, cleanup: boolean): void {
    if (
      photonmanager.Instance.photon_instance.myActor().actorNr ==
      photonmanager.Instance.photon_instance.myRoomMasterActorNr()
    ) {
      this.wall.stopwatchTimer();
    }
    if (this.joined && photonmanager.Instance.GameStartStatus) {
      this.player_movement.destroycharacter(actor);
    }
    if (!photonmanager.Instance.GameStartStatus && this.isJoinedToRoom()) this.player_lobby.leaveplayerinlobby(actor);
  }

  onMyRoomPropertiesChange(): void {
    // console.log("Timer Updated");
    if (!photonmanager.Instance.GameStartStatus) {
      console.log("Timer in Photon", photonmanager.Instance.photon_instance.myRoom().getCustomProperty("timer"));
      if (
        photonmanager.Instance.photon_instance.myRoom().getCustomProperty("timer") >= 0 &&
        photonmanager.Instance.photon_instance.myRoom().getCustomProperty("timer") < 50
      ) {
        console.log("Inside If condition");
        photonmanager.Instance.PlayerScriptRef?.updateOtherPlayerTimer();
      } else {
      }
    } else {
      console.log("Inside else block");
      photonmanager.Instance.WallCollisionRef?.updateOtherPlayerTimer();
    }
  }

  onStateChange(state: number): void {
    console.log(state);
    // this.check();
  }
  check() {
    if (this.checker) {
      if (this.isInLobby() && !this.isJoinedToRoom()) {
        var name = "abcde";
        this.joinRandomOrCreateRoom({ expectedMaxPlayers: 2 }, undefined, {
          emptyRoomLiveTime: 20000,
          suspendedPlayerLiveTime: 20000,
          maxPlayers: 2,
        });
        this.checker = 0;
      }
    }
  }
}
photonmanager.Instance.photon_instance = new photon();
