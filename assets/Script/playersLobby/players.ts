import {
    _decorator,
    Component,
    Node,
    Prefab,
    JsonAsset,
    instantiate,
    UITransform,
    director,
    Input,
    Sprite,
    NodePool,
    log,
    Label,
} from "cc";
// import { gameData } from '../../gameData';
// import { modes } from '../Modes/scripts/modes';
import { photonmanager } from "../../Script/photon/photonmanager";
import { gameData } from "../singleton/gameData";
import { Photonevents } from "../photon/cloud-app-info";
const { ccclass, property } = _decorator;

@ccclass("playerslobby")
export class playerslobby extends Component {
    @property({ type: Prefab })
    players: Prefab = null;
    @property({ type: Prefab })
    player: Prefab = null;
    @property({ type: Prefab })
    map: Prefab = null;

    @property({ type: JsonAsset })
    playerCountInfo: JsonAsset = null;

    @property({ type: Node })
    selectMapButton: Node = null;

    @property({ type: Node })
    MostVotedMap: Node = null;
    @property({ type: Prefab })
    timer: Prefab = null;

    gameDataInstance;
    photon: any;

  targetMapNode;
  allNums: number[];
  Min: number = 0;
  Sec: number = 15;
  Timer: any;
  start() {
    this.photon.player_lobbys = this;
  }
  onLoad() {
    this.gameDataInstance = gameData.getInstance();
    this.instantiatePlayers();
    this.selectMapButton.on(Input.EventType.TOUCH_START, this.SelectMap);
    photonmanager.getInstance().playerScriptRef = this;
    console.log("Target Map Node", this.targetMapNode);

        this.photon = photonmanager.getInstance().photon_instance;
        console.log("photon data", this.photon);

        this.photon.myRoom().setCustomProperty("totalzombies", 0);
        photonmanager.getInstance().photon_instance.myRoom().setCustomProperty("gamestarted", false);
    }

    /**
     * This function instantiates the players and display them on the scene
     */

    instantiatePlayers = () => {
        /**
         * This part decides the no of players according to the mode and assign it to the noOfPlayers variable
         */

        let modeIndex = this.gameDataInstance.getModeOnSelect();
        let noOfPlayers = 0;
        this.playerCountInfo.json.forEach((element) => {
            if (element.index == modeIndex) {
                noOfPlayers = element.noOfPlayers;
            }
        });
        let count = 0;
        let flag = true;
        let row = 0;
        for (let i = 0; i < noOfPlayers; i++) {
            const player = instantiate(this.players);
            player.name = i.toString();
            const playerWidth = player.getComponent(UITransform).width + 20;
            const playerHeight = player.getComponent(UITransform).height + 20;
            const backgroundWidth = player.getComponent(UITransform).width;
            const position = player.getPosition();

            if (position.x + playerWidth * count >= backgroundWidth + playerWidth) {
                row++;
                count = 0;
                player.setPosition(position.x + playerWidth * count, position.y - playerHeight * row);
                flag = false;
                count++;
            } else {
                if (!flag) {
                    player.setPosition(position.x + playerWidth * count, position.y - playerHeight * row);
                } else {
                    player.setPosition(position.x + playerWidth * count, position.y);
                }
                count++;
            }
            this.node.addChild(player);
        }
    };

    addplayerinlobby() {
        let actorcount = this.photon.myRoomActorCount();
        var actors = Object.keys(this.photon.myRoomActors()).map((key) => {
            return this.photon.myRoomActors()[key];
        });

        let place = 0;
        actors.forEach((actor) => {
            console.log(this.node.getChildByName((actorcount - 1).toString()).children.length);

            if (this.node.getChildByName(place.toString()).children.length == 0) {
                console.log(this.player);

                const player = instantiate(this.player);
                player.name = actor.actorNr.toString();
                this.node.getChildByName(place.toString()).addChild(player);
                console.log(player);
            }

            place++;
        });
    }
    leaveplayerinlobby(a) {
        if (this.player != null) {
            const player = instantiate(this.player);
            let actorcount = this.photon.myRoomActorCount();
            var actors = Object.keys(this.photon.myRoomActors()).map((key) => {
                return this.photon.myRoomActors()[key];
            });
            let destroy = new NodePool();
            for (let i = 0; i < 6; i++) {
                if (i < 5)
                    if (this.node.getChildByName(i.toString()).children.length != 0 && i < 5) {
                        console.log(a.actorNr);
                        destroy.put(this.node.getChildByName(i.toString()).children[0]);
                    }
                if (i == 5) {
                    this.addplayerinlobby();
                }
            }
        }
    }

    /**
     *
     * @param event It is the touch event. It is used to display a list of available maps on the screen on click of a button
     */
    SelectMap = (event) => {
        this.selectMapButton.active = false;
        let map = instantiate(this.map);
        this.node.parent.addChild(map);
        // director.loadScene("map")
    };

    showMapWithMaxVotes = (targetMapNode: Node) => {
        // console.log("Entered");
        // console.log(targetMapNode);

        let TargetMapNodeSpriteFrame = targetMapNode.getComponent(Sprite).spriteFrame;
        this.MostVotedMap.getComponent(Sprite).spriteFrame = TargetMapNodeSpriteFrame;
    };
    StartGame() {
        console.log(photonmanager.getInstance().gamestarted);

        if (!photonmanager.getInstance().gamestarted)
            director.loadScene("gameplay", () => {
                photonmanager.getInstance().photon.myRoom().setIsOpen(false);
                photonmanager.getInstance().photon.myRoom().setIsVisible(false);
                console.log(photonmanager.getInstance().photon.myRoom().isOpen);
                this.allNums = Array.from({ length: 5 - 1 + 1 }, (_, i) => i + 1);
                for (let i = this.allNums.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.allNums[i], this.allNums[j]] = [this.allNums[j], this.allNums[i]];
                }
                var actors = Object.keys(photonmanager.getInstance().photon.myRoomActors()).map((key) => {
                    return photonmanager.getInstance().photon.myRoomActors()[key];
                });
                console.log(this.allNums);

                actors.forEach((player, i) => {
                    if (i + 1 == this.allNums[0]) {
                        player.setCustomProperty("zombie", true);
                    }
                });

                photonmanager.getInstance().photon.myRoom().setCustomProperty("liveplayers", 0);
                photonmanager.getInstance().photon.joined = true;
                photonmanager.getInstance().gamestarted = true;
                photonmanager.getInstance().photon.raiseEvent(Photonevents.Startgame, {}, {});
            });
    }

  stopwatchTimer() {
    let timer = instantiate(this.timer);
    this.node.addChild(timer);
    this.Timer = this.node.getChildByName("Timer");
    photonmanager.getInstance().photon_instance.myRoom().setCustomProperty("timer", 5);
    if (
      photonmanager.getInstance().photon_instance.myActor().actorNr ==
      photonmanager.getInstance().photon_instance.myRoomMasterActorNr()
    ) {
      this.schedule(this.timerworking, 1);
      if (this.Min == 0 && this.Sec == 0) {
        this.unschedule(this.timerworking);
      }
    }
  }
  /**
   * @description Callback Function Scheduled after every Sec until reaches 00:00
   */
  timerworking() {
    if (this.Min > 0 || this.Sec > 0) {
      if (this.Sec == 0) {
        this.Sec = 60;
        this.Min--;
        if (this.Min == 0 && this.Sec == 0) {
          this.Min = 60;
        }
      }
      let date = new Date();
      let time = date.getSeconds();
      let timeProperty = photonmanager.getInstance().photon_instance.myRoom().getCustomProperty("timer");

      console.log("Timer Property", timeProperty--);
      photonmanager.getInstance().photon_instance.myRoom().setCustomProperty("timer", timeProperty);
      console.log("TIMER", time);
      // this.Sec = -(this.Sec-time);
      console.log("GETTING PROPERTY", photonmanager.getInstance().photon_instance.myRoom().getCustomProperty("timer"));
      this.Sec = photonmanager.getInstance().photon_instance.myRoom().getCustomProperty("timer");
      let m = this.Min < 10 ? "0" + this.Min : this.Min;
      let s = this.Sec < 10 ? "0" + this.Sec : this.Sec;
      this.Timer.getComponent(Label).string = m.toString() + ":" + s.toString();
    }
  }

  updateOtherPlayerTimer() {
    this.Sec = photonmanager.getInstance().photon_instance.myRoom().getCustomProperty("timer");
    let m = this.Min < 10 ? "0" + this.Min : this.Min;
    let s = this.Sec < 10 ? "0" + this.Sec : this.Sec;
    if (this.Timer.getComponent(Label) != null) {
      this.Timer.getComponent(Label).string = m.toString() + ":" + s.toString();
    }
  }

  starts = true;
  counterstarted = true;
  //maximum number of player in room
  playertostartgame = 2;
  update(deltaTime: number) {
    this.targetMapNode = this.gameDataInstance.getMapWithMaxVotes();
    if (this.targetMapNode != null) {
      this.showMapWithMaxVotes(this.targetMapNode);
    }
    if (photonmanager.getInstance().photon.myRoomActorCount() == this.playertostartgame && this.counterstarted) {
      this.stopwatchTimer();
      this.counterstarted = false;
    } else if (
      this.counterstarted == false &&
      photonmanager.getInstance().photon.myRoomActorCount() < this.playertostartgame
    ) {
      console.log("bbbb");
      this.Min = 0;
      this.Sec = 0;
      this.node.getChildByName("Timer").destroy();
      this.counterstarted = true;
    }
    if (
      photonmanager.getInstance().photon.myRoomActorCount() == this.playertostartgame &&
      this.starts &&
      photonmanager.getInstance().photon_instance.myActor().actorNr ==
        photonmanager.getInstance().photon_instance.myRoomMasterActorNr() &&
      !photonmanager.getInstance().photon.gamestarted
    ) {
      if (this.Min == 0 && this.Sec == 0) {
        this.StartGame();
        photonmanager.getInstance().photon_instance.myRoom().setCustomProperty("gamestarted", true);
        this.starts = false;
      }
    }
  }
}
