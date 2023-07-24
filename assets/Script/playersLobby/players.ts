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
  SpriteFrame,
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

  gameDataInstance: gameData;
  photon: any;

  targetMapNode: Node = null;
  allNums: number[];
  Min: number = 0;
  Sec: number = 20;
  Timer: Node = null;
  selectedMap: Node = null;
  TargetMapNodeSpriteFrame: SpriteFrame = null;
  emptySprite: SpriteFrame = null;
  starts: boolean = true;
  counterstarted: boolean = true;
  //maximum number of player in room
  playertostartgame: number = 1;
  start() {
    this.photon.player_lobbys = this;
  }
  onLoad() {
    this.gameDataInstance = gameData.getInstance();
    this.instantiatePlayers();
    this.selectMapButton.on(Input.EventType.TOUCH_START, this.SelectMap);
    photonmanager.Instance.PlayerScriptRef = this;
    this.photon = photonmanager.Instance.photon_instance;
    this.photon.myRoom().setCustomProperty("totalzombies", 0);
    photonmanager.Instance.photon_instance.myRoom().setCustomProperty("gamestarted", false);
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
  protected onEnable(): void {
    this.selectedMap = null;
    this.MostVotedMap.getComponent(Sprite).spriteFrame = null;
    this.gameDataInstance.setmapWithMaxVotes = null;
    this.TargetMapNodeSpriteFrame = null;
  }
  addplayerinlobby() {
    let actorcount = this.photon.myRoomActorCount();
    var actors = Object.keys(this.photon.myRoomActors()).map((key) => {
      return this.photon.myRoomActors()[key];
    });

    let place = 0;
    actors.forEach((actor) => {
      if (this.node.getChildByName(place.toString()).children.length == 0) {
        const player = instantiate(this.player);
        player.name = actor.actorNr.toString();
        this.node.getChildByName(place.toString()).addChild(player);
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
    this.selectedMap = instantiate(this.map);
    this.node.parent.addChild(this.selectedMap);
  };

  showMapWithMaxVotes = (targetMapNode: Node) => {
    this.TargetMapNodeSpriteFrame = targetMapNode.getComponent(Sprite).spriteFrame;
    this.MostVotedMap.getComponent(Sprite).spriteFrame = this.TargetMapNodeSpriteFrame;
  };
  StartGame() {
    if (!photonmanager.Instance.GameStartStatus)
      director.loadScene("gameplay", () => {
        photonmanager.Instance.PhotonRef.myRoom().setIsOpen(false);
        photonmanager.Instance.PhotonRef.myRoom().setIsVisible(false);
        this.allNums = Array.from({ length: 5 - 1 + 1 }, (_, i) => i + 1);
        for (let i = this.allNums.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.allNums[i], this.allNums[j]] = [this.allNums[j], this.allNums[i]];
        }
        var actors = Object.keys(photonmanager.Instance.PhotonRef.myRoomActors()).map((key) => {
          return photonmanager.Instance.PhotonRef.myRoomActors()[key];
        });
        actors.forEach((player, i) => {
          if (i + 1 == this.allNums[0]) {
            player.setCustomProperty("zombie", true);
          }
        });

        photonmanager.Instance.PhotonRef.myRoom().setCustomProperty("liveplayers", 0);
        photonmanager.Instance.PhotonRef.joined = true;
        photonmanager.Instance.GameStartStatus = true;
        photonmanager.Instance.PhotonRef.raiseEvent(Photonevents.Startgame, {}, {});
      });
  }

  stopwatchTimer() {
    let timer = instantiate(this.timer);
    this.node.addChild(timer);
    this.Timer = this.node.getChildByName("Timer");
    photonmanager.Instance.photon_instance.myRoom().setCustomProperty("timer", this.Sec);
    if (
      photonmanager.Instance.photon_instance.myActor().actorNr ==
      photonmanager.Instance.photon_instance.myRoomMasterActorNr()
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
      let timeProperty = photonmanager.Instance.photon_instance.myRoom().getCustomProperty("timer");
      photonmanager.Instance.photon_instance.myRoom().setCustomProperty("timer", timeProperty);
      this.Sec = photonmanager.Instance.photon_instance.myRoom().getCustomProperty("timer");
      let m = this.Min < 10 ? "0" + this.Min : this.Min;
      let s = this.Sec < 10 ? "0" + this.Sec : this.Sec;
      this.Timer.getComponent(Label).string = m.toString() + ":" + s.toString();
    }
  }

  updateOtherPlayerTimer() {
    this.Sec = photonmanager.Instance.photon_instance.myRoom().getCustomProperty("timer");
    let m = this.Min < 10 ? "0" + this.Min : this.Min;
    let s = this.Sec < 10 ? "0" + this.Sec : this.Sec;
    if (this.Timer.getComponent(Label) != null) {
      this.Timer.getComponent(Label).string = m.toString() + ":" + s.toString();
    }
  }

  update(deltaTime: number) {
    this.targetMapNode = this.gameDataInstance.getMapWithMaxVotes();
    if (this.targetMapNode != null) {
      this.showMapWithMaxVotes(this.targetMapNode);
    }
    if (photonmanager.Instance.PhotonRef.myRoomActorCount() == this.playertostartgame && this.counterstarted) {
      this.stopwatchTimer();
      this.counterstarted = false;
    } else if (
      this.counterstarted == false &&
      photonmanager.Instance.PhotonRef.myRoomActorCount() < this.playertostartgame
    ) {
      this.Min = 0;
      this.Sec = 0;
      this.node.getChildByName("Timer").destroy();
      this.counterstarted = true;
    }
    if (
      photonmanager.Instance.PhotonRef.myRoomActorCount() == this.playertostartgame &&
      this.starts &&
      photonmanager.Instance.photon_instance.myActor().actorNr ==
        photonmanager.Instance.photon_instance.myRoomMasterActorNr() &&
      !photonmanager.Instance.GameStartStatus
    ) {
      if (this.Min == 0 && this.Sec == 0) {
        this.StartGame();
        photonmanager.Instance.photon_instance.myRoom().setCustomProperty("gamestarted", true);
        this.starts = false;
      }
    }
  }
}
