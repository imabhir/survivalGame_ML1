import { PlayerMovement } from "../Player/PlayerMovement";
import config, { Photonevents } from "./cloud-app-info";
import { Event } from "../photon/photonconstants";
import { photonmanager } from "./photonmanager";
import { Color, director, log } from "cc";
import { playerslobby } from "../playersLobby/players";
import { Message } from "../ChatScript/Message";
import { walls } from "../wallscollisions";
var photon_instance;
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
  checker = 1;
  player_movement: PlayerMovement;
  player_lobby: playerslobby;
  ConnectOnStart = true;
  message: Message = null;
  wall: walls = null;
  totalmessages: any = [];

  maps = { map0: 0, map1: 0, map2: 0, map3: 0 };
  constructor() {
    super(photonWss ? 1 : 0, photonAppId, photonAppVersion);
    this.logger.info("Photon Version: " + Photon.Version + (Photon.IsEmscriptenBuild ? "-em" : ""));
    // uncomment to use Custom Authentication
    // config.setCustomAuthentication("username=" + "yes" + "&token=" + "yes");
    this.logger.info("Init", this.getNameServerAddress(), photonAppId, photonAppVersion);
    this.setLogLevel(Exitgames.Common.Logger.Level.INFO);
    // this.data = data_manager.getInstance()
    // this.player_movement = new PlayerMovement;
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

        //config.connectToNameServer({ region: "EU", lobbyType: Photon.LoadBalancing.Constants.LobbyType.Default });
      }
    }
  }

  joined = false;
  onJoinRoom(createdByMe: boolean): void {
    console.log(this.myRoom());
  }
  onActorJoin(actor: Photon.LoadBalancing.Actor): void {
    console.log(actor);
    console.log(photonmanager.getInstance().photon.myRoom());
    console.log(this.myRoomActorCount());
    if (!photonmanager.getInstance().photon.joined) this.player_lobby.addplayerinlobby();
    // this.addedactor
    // this.data.countofactors = this.myRoomActorCount();
    //this.player.addplayer();
    if (this.joined) {
      this.player_movement.addedactor(actor);

      console.log("logged");
    }
  }

  onEvent(Event: number, content: any, actorNr: number): void {
    // console.log(Event);
    // this.raiseEvent
    if (Event == Photonevents.Startgame) {
      this.joined = true;
      if (!photonmanager.getInstance().gamestarted)
        director.loadScene("gameplay", () => {
          photonmanager.getInstance().photon.myRoom().isOpen = false;
          photonmanager.getInstance().gamestarted = true;
          this.myRoom().setIsOpen(false);
          this.myRoom().setIsVisible(false);
          photonmanager.getInstance().photon.CloseAvailableRoom;
          photonmanager.getInstance().photon.joined = true;
          photonmanager.getInstance().gamestarted = true;
          photonmanager.getInstance().photon.raiseEvent(Photonevents.Startgame, {}, {});
        });
    } else if (Event == Photonevents.Killotheractor) {
      this.player_movement.kill_otheractor(null, content);
    } else if (Event == Photonevents.Killotheractors) {
      console.log("killed");

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
    } else if (this.joined && Event == Photonevents.Animation && photonmanager.getInstance().gamestarted) {
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
      if (this.joined && photonmanager.getInstance().gamestarted)
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
  onActorPropertiesChange(actor: Photon.LoadBalancing.Actor): void {
    // if (this.joined && photonmanager.getInstance().gamestarted)
    //     this.player_movement.move_actor(actor)
  }
  onActorLeave(actor: Photon.LoadBalancing.Actor, cleanup: boolean): void {
    if (this.joined && photonmanager.getInstance().gamestarted) {
      this.player_movement.destroycharacter(actor);
      console.log("a");
    }
    console.log("gaya");
    if (!photonmanager.getInstance().gamestarted && this.isJoinedToRoom()) this.player_lobby.leaveplayerinlobby(actor);
  }

  onMyRoomPropertiesChange(): void {
    // console.log("Timer Updated");
    if (!photonmanager.getInstance().gamestarted) {
      console.log("Timer in Photon", photonmanager.getInstance().photon_instance.myRoom().getCustomProperty("timer"));
      if (
        photonmanager.getInstance().photon_instance.myRoom().getCustomProperty("timer") >= 0 &&
        photonmanager.getInstance().photon_instance.myRoom().getCustomProperty("timer") < 50
      ) {
        console.log("Inside If condition");
        photonmanager.getInstance().playerScriptRef?.updateOtherPlayerTimer();
      } else {
      }
    } else {
      console.log("Inside else block");
      photonmanager.getInstance().wallCollisionRef?.updateOtherPlayerTimer();
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

photonmanager.getInstance().photon_instance = new photon();
