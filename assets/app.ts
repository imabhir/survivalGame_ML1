// ///<reference path="Photon-Javascript_SDK.d.ts"/>
// import { Component, log, randomRange } from "cc";
// import a from "./cloud-app-info"
// import { data_manager } from "./Script/data_manager";
// import { walls } from "./Script/wallscollisions";
// // fetching app info global variable while in global context
// var DemoWss = a && a.Wss;
// var DemoAppId = a && a.AppId ? a.AppId : "a36f3ed3-e604-4772-9b98-985d37c5f6ac";
// var DemoAppVersion = a && a.AppVersion ? a.AppVersion : "1.0";
// var DemoMasterServer = a && a.MasterServer;
// var DemoNameServer = a && a.NameServer;
// var DemoRegion = a && a.Region;
// var DemoFbAppId = a && a.FbAppId;

// var ConnectOnStart = true;
// var player: walls;
// var data: data_manager;
// export default class DemoLoadBalancing extends Photon.LoadBalancing.LoadBalancingClient {
//     logger = new Exitgames.Common.Logger("Demo:");



//     private USERCOLORS = ["#FF0000", "#00AA00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];
//     private name = ["#FF0000", "#00AA00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];
//     a = 1;





//     data: data_manager;
//     constructor() {
//         super(DemoWss ? Photon.ConnectionProtocol.Wss : Photon.ConnectionProtocol.Ws, DemoAppId, DemoAppVersion);

//         this.logger.info("Photon Version: " + Photon.Version + (Photon.IsEmscriptenBuild ? "-em" : ""));

//         // uncomment to use Custom Authentication
//         // a.setCustomAuthentication("username=" + "yes" + "&token=" + "yes");


//         this.logger.info("Init", this.getNameServerAddress(), DemoAppId, DemoAppVersion);
//         this.setLogLevel(Exitgames.Common.Logger.Level.INFO);

//         this.myActor().setCustomProperty("color", this.USERCOLORS[0]);
//         data = data_manager.getInstance()
//         this.myActor().setCustomProperty("position", data.actorproperty);
//     }
//     start() {
//         if (ConnectOnStart) {
//             if (DemoMasterServer) {
//                 this.setMasterServerAddress(DemoMasterServer);
//                 this.connect();
//             }
//             if (DemoNameServer) {
//                 this.setNameServerAddress(DemoNameServer);
//                 this.connectToRegionMaster(DemoRegion || "in");
//             }
//             else {
//                 this.connectToRegionMaster(DemoRegion || "in");

//                 //a.connectToNameServer({ region: "EU", lobbyType: Photon.LoadBalancing.Constants.LobbyType.Default });
//             }
//         }
//     }

//     onJoinRoom(createdByMe: boolean): void {
//         console.log(createdByMe);
//     }
//     onActorJoin(actor: Photon.LoadBalancing.Actor): void {
//         console.log(actor
//         );
//         console.log(this.myRoomActorCount());

//         // this.addedactor
//         data.countofactors = this.myRoomActorCount();
//         //this.player.addplayer();

//     }
//     onActorPropertiesChange(actor: Photon.LoadBalancing.Actor): void {
//         console.log(actor.getCustomProperty("position"));

//     }
//     onActorLeave(actor: Photon.LoadBalancing.Actor, cleanup: boolean): void {
//         console.log("gaya")
//     }
//     onMyRoomPropertiesChange(): void {
//         console.log("a");
//     }
//     onStateChange(state: number): void {
//         console.log(state);
//         this.check();
//     }
//     property() {
//         if (Math.floor(data.actorproperty.x) != Math.floor(this.myActor().getCustomProperty("position").x))
//             this.myActor().setCustomProperty("position", data.actorproperty);
//     }
//     check() {

//         if (this.a) {
//             if (this.isInLobby()) {
//                 var name = "abcde";
//                 this.joinRandomOrCreateRoom({ expectedMaxPlayers: 2 },
//                     undefined,
//                     { emptyRoomLiveTime: 20000, maxPlayers: 2 });
//                 this.a = 0;
//             }
//         }

//     }
// }
// // setTimeout(() => {
// //     var a = new DemoLoadBalancing();
// //     a.start();
// //     if (data)
// //         setInterval(() => {
// //             a.property();
// //         }, 1)
// // }, 1000);
