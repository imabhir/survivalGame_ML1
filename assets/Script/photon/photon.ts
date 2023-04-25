import { PlayerMovement } from "../Player/PlayerMovement";
import config, { Photonevents } from "./cloud-app-info";
import { Event } from "../photon/photonconstants"
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
    player_lobby: playerslobby
    ConnectOnStart = true;
    message: Message = null;
    wall: walls = null;
    totalmessages: any = [];
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
            }
            else {
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
        console.log(actor
        );
        console.log(photonmanager.getInstance().photon.myRoom()
        );
        console.log(this.myRoomActorCount());
        if (!photonmanager.getInstance().photon.joined)
            this.player_lobby.addplayerinlobby();
        // this.addedactor
        // this.data.countofactors = this.myRoomActorCount();
        //this.player.addplayer();
        if (this.joined)
            this.player_movement.addedactor(actor)
        if (actor.actorNr != this.myActor().actorNr)
            this.raiseEvent(420, { gamestarted: photonmanager.getInstance().gamestarted })


    }


    onEvent(Event: number, content: any, actorNr: number): void {
        console.log(Event);
        this.raiseEvent
        if (Event == 100) {
            this.joined = true;
            if (!photonmanager.getInstance().gamestarted)
                director.loadScene("gameplay", () => { photonmanager.getInstance().photon.myRoom().isOpen = false; photonmanager.getInstance().photon.CloseAvailableRoom; photonmanager.getInstance().photon.joined = true; photonmanager.getInstance().gamestarted = true; photonmanager.getInstance().photon.raiseEvent(100, {}, {}); })
        } else if (Event == 113) {

            this.player_movement.kill_otheractor(null, content)
        }
        else if (Event == 48) {
            console.log("killed");

            this.player_movement.kill_otheractor(null, content)
        }
        else if (Event == 420) {
            photonmanager.getInstance().gamestarted = content.gamestarted
            this.myRoom().setIsOpen(false)
            this.myRoom().setIsVisible(false)
        }
        else if (Photonevents.Openchest == Event) {
            if (this.wall != null)
                this.wall.openchest(actorNr)
        }
        else if (Photonevents.Ghostchat == Event) {
            if (this.message != null) {
                this.message.recievedmessage(content.ReqMessage, content.color);
            }
            else {
                this.totalmessages.push({ reqMessage: content.ReqMessage, color: content.color })
            }
        }
        else if (this.joined && Event == 115 && photonmanager.getInstance().gamestarted) {
            console.log("enable");
            if (this.player_movement != null)


                this.player_movement.enableanimation(actorNr, content);
        }
        else if (Event == 116) {
            if (this.wall != null) {



                this.wall.fireatotheractor({ ...content, actorNr: actorNr.toString() })




            }
        }
        else if (Event == 133) {
            if (this.wall != null) {
                this.wall.kill_actor(content)
            }
        }
        else if (Event == Photonevents.Move) {
            if (this.joined && photonmanager.getInstance().gamestarted)
                if (this.player_movement != null)

                    this.player_movement.move_actor(content)
        }
        else if (Event == 52) {
            console.log("killed");

            this.player_movement.zombie_otheractor(null, content)
        }
        else if (Event == 62) {
            console.log("killed");

            this.wall.zombie_actor(content)
        }

    }
    onActorPropertiesChange(actor: Photon.LoadBalancing.Actor): void {
        // if (this.joined && photonmanager.getInstance().gamestarted)
        //     this.player_movement.move_actor(actor)
    }
    onActorLeave(actor: Photon.LoadBalancing.Actor, cleanup: boolean): void {
        if (this.joined && photonmanager.getInstance().gamestarted) {
            this.player_movement.destroycharacter(actor); console.log("a");
        }
        console.log("gaya");
        if (!photonmanager.getInstance().gamestarted)
            this.player_lobby.leaveplayerinlobby(actor);
    }
    onMyRoomPropertiesChange(): void {
        console.log("config");
    }
    onStateChange(state: number): void {
        console.log(state);
        // this.check();
    }
    check() {
        if (this.checker) {
            if (this.isInLobby() && !this.isJoinedToRoom()) {
                var name = "abcde";
                this.joinRandomOrCreateRoom({ expectedMaxPlayers: 2 },
                    undefined,
                    { emptyRoomLiveTime: 20000, suspendedPlayerLiveTime: 20000, maxPlayers: 2 });
                console.log("ban gaya");
                this.checker = 0;
            }
        }
    }
}

photonmanager.getInstance().photon_instance = new photon;



