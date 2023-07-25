import {
  _decorator,
  Component,
  Node,
  TiledMap,
  PhysicsSystem2D,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
  Rect,
  UITransform,
  Vec3,
  TiledLayer,
  TiledTile,
  RigidBody2D,
  BoxCollider2D,
  Vec2,
  ERigidBody2DType,
  Prefab,
  instantiate,
  Button,
  Sprite,
  math,
  SpriteFrame,
  Color,
  Label,
} from "cc";
import { photonmanager } from "./photon/photonmanager";
import { Photonevents } from "./photon/cloud-app-info";
import { PlayerMovement } from "./Player/PlayerMovement";
import { Message } from "./ChatScript/Message";
import { GameOver } from "./GameOver/GameOver";

const { ccclass, property } = _decorator;
const { cos, sin, PI } = Math;
const rad = (deg) => (deg * PI) / 180;
const cosd = (deg) => cos(rad(deg));
const sind = (deg) => sin(rad(deg));
@ccclass("walls")
export class walls extends Component {
  @property({ type: Node }) player: Node = null;
  @property({ type: Node }) camera: Node = null;
  @property({ type: Node }) hudNode: Node = null;
  @property({ type: Node }) joystick: Node = null;
  @property({ type: Node }) camera000: Node = null;
  @property({ type: Node }) controller: Node = null;
  @property({ type: Node }) maincamera: Node = null;
  @property({ type: Node }) use_button: Node = null;
  @property({ type: Node }) kill_button: Node = null;
  @property({ type: Node }) chest_button: Node = null;
  @property({ type: Node }) joyStickBall: Node = null;
  @property({ type: Prefab }) minigames: Node[][] = [];
  @property({ type: Node }) intrectibleNode: Node = null;
  @property({ type: Prefab }) player_prefab: Prefab = null;
  @property({ type: Prefab }) bounding_box: Prefab = null;
  @property({ type: Prefab }) chest_prefab: Prefab = null;
  @property({ type: Prefab }) gameovernode: Prefab = null;
  @property({ type: Prefab }) chat_prefab: Prefab = null;
  @property({ type: Prefab }) bullet: Prefab = null;
  @property({ type: Prefab }) timer: Prefab = null;
  @property({ type: Prefab }) gun: Prefab = null;
  @property({ type: SpriteFrame }) killed_sprite: SpriteFrame = null;

  Min: number = 2;
  Sec: number = 5;
  count: number = 0;
  actors: number = 0;
  use_button_checker: number = 0;
  kill_button_checker: number = 0;
  chest_button_checker: number = 0;
  intervaloffire: number = 0;
  rateoffire: number = 10;
  totalSec: number = 0;
  anlges: number = 0;
  kill_actor_name: string;
  player_bb: Rect;
  map: any;
  photon_instance: any;
  killed_actor: any;
  chat: any = false;
  intialPos: Vec3 = null;
  finalPosBall: Vec3 = null;
  startPos: Vec3 = null;
  chest: boolean = false;
  canmoveweapon: boolean;
  canfire: boolean = false;
  collided: boolean = false;
  minigame: Node;
  Timer: Node = null;
  demo: Photon.LoadBalancing.LoadBalancingClient;

  onLoad() {
    this.totalSec = this.Min * 60 + this.Sec;
    PhysicsSystem2D.instance.enable = true;
    // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;
    photonmanager.Instance.WallCollisionRef = this;
    this.map = this.node.getComponent(TiledMap);
    // //console.log(this.node.getComponent(TiledMap).getObjectGroups())
    this.camera.setPosition(this.maincamera.getPosition());
    this.camera000.setPosition(this.maincamera.getPosition());
    this.use_button.getComponent(Button).interactable = false;
    this.kill_button.getComponent(Button).interactable = false;
    this.chest_button.getComponent(Button).interactable = false;

    this.photon_instance = photonmanager.Instance.photon_instance;

    this.photon_instance.wallclass = this;
    this.finalPosBall = new Vec3(1, 1, 0);
    this.intialPos = new Vec3(1, 1, 0);
    this.startPos = this.joyStickBall.getPosition();

    this.touchEventsFunc();
    this.stopwatchTimer();
    this.addRigidBody();
    PhysicsSystem2D.instance.enable = true;
    // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;
    if (PhysicsSystem2D.instance) {
      //physics handler to check for collsions
      PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      PhysicsSystem2D.instance.on(
        Contact2DType.END_CONTACT,
        () => {
          this.collided = false;
        },
        this
      );
    }
  }

  start() {
    //refer to link https://juejin.cn/post/7068114266716373029
    this.enablecollision("level1");
    // //console.log("logged");
    this.setUpConnection();
    this.node
      .getComponent(TiledMap)
      .getObjectGroup("interactables")
      .getObjects()
      .forEach((e) => {
        if (e!.prefab_type == "chest") {
          let chest = instantiate(this.chest_prefab);
          let worldposition = this.player.parent.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(e.x, e.y, 0));
          let position = this.player.parent.getComponent(UITransform).convertToNodeSpaceAR(worldposition);
          //console.log(position, e.x * 0.5);
          chest.setPosition(
            position.x - this.node.getComponent(UITransform).width * 0.5,
            position.y - this.node.getComponent(UITransform).height * 0.5
          );
          ////console.log(chest);

          this.player.parent.addChild(chest);
        }
      });
  }
  setUpConnection() {}
  // setRoomProperties() {}
  touchEventsFunc() {
    //touch events handler
    this.joyStickBall.on(Node.EventType.TOUCH_START, this.touchStart, this);
    this.joyStickBall.on(
      Node.EventType.TOUCH_MOVE,
      (e) => {
        this.touchMove(e);
      },
      this
    );
    this.joyStickBall.on(Node.EventType.TOUCH_END, this.touchEnd, this);
    this.joyStickBall.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
  }
  touchEnd() {
    this.joyStickBall.setPosition(0, 0, 0);
    this.canmoveweapon = false;
    this.canfire = false;
  }
  touchStart() {
    this.joyStickBall.setPosition(0, 0, 0);
    this.canmoveweapon = true;
    // //console.log("abcde");
  }
  touchMove(e) {
    this.intialPos = this.controller
      .getComponent(UITransform)
      .convertToNodeSpaceAR(new Vec3(e.getUILocation().x, e.getUILocation().y, e.getUILocation().z)); //controller node is passed as an property to get its height and width such that the cameras motion doesnt effect the position
    var len = this.intialPos.length();
    var joyStickBallBaseWidth = this.controller.getComponent(UITransform).getBoundingBox().width / 2;
    if (len > joyStickBallBaseWidth) {
      //to check if the joystickball is within the length of the joystick
      this.intialPos.x = (this.intialPos.x * joyStickBallBaseWidth) / len;
      this.intialPos.y = (this.intialPos.y * joyStickBallBaseWidth) / len;
      if (this.player.getChildByName("gun").children.length != 0) this.canfire = true;
    }
    var dy = this.intialPos.y;
    var dx = this.intialPos.x;
    var angleRad = Math.atan2(dy, dx);
    var angleDeg = (angleRad * 180) / Math.PI;
    this.joyStickBall.setPosition(this.intialPos);
    if (angleDeg < 0) {
      this.anlges = angleDeg + 360; //convert angle to positive
    } else {
      this.anlges = angleDeg;
    }
    // //console.log(this.anlges);
    this.player.getChildByName("gun").angle = this.anlges;
    this.player.getComponent(PlayerMovement).getDirection(this.player, this.anlges);
    // this.anlges = angleDeg < 0 ? angleDeg - 180 : angleDeg + 90
  }
  enablecollision(name) {
    let layer: TiledLayer = this.map.getLayer(name);

    layer.getComponent(UITransform).setAnchorPoint(0, 0);
    let tilesize = layer.getMapTileSize();
    for (let intervaloffire = 0; intervaloffire < layer.getLayerSize().width; intervaloffire++) {
      for (let j = 0; j < layer.getLayerSize().height; j++) {
        let tile: TiledTile = layer.getTiledTileAt(intervaloffire, j, true);
        if (tile.grid != 0) {
          tile.addComponent(RigidBody2D);
          tile.getComponent(RigidBody2D).type = ERigidBody2DType.Static;
          tile.getComponent(RigidBody2D).allowSleep = false;
          tile.getComponent(RigidBody2D).awakeOnLoad = true;
          tile.getComponent(RigidBody2D).gravityScale = 0;
          tile.getComponent(RigidBody2D).allowSleep = true;
          let collider = tile.addComponent(BoxCollider2D);
          collider.size = tilesize;
          collider.density = 1000;
          collider.restitution = 0;
          collider.offset = new Vec2(tilesize.width / 2, tilesize.height / 2);
          collider.apply();
        }
      }
    }
  }
  open() {
    if (this.chest) {
      // //console.log("opened");
      let gun = instantiate(this.gun);
      this.player.getChildByName("gun").addChild(gun);
      this.player.updateWorldTransform(); // 4
      this.chest = false;
      this.chest_button_checker = 0;
      this.kill_button.getComponent(Button).interactable = false;
      this.photon_instance.raiseEvent(Photonevents.Openchest, {});
    } else {
      //console.log(this.node.parent.getChildByName(this.minigame.name));

      if (this.node.parent.getChildByName(this.minigame.name) == null) {
        //console.log(this.minigame.name);
        this.node.parent.addChild(this.minigame);
      }
      // //console.log("b");
      this.use_button.getComponent(Button).interactable = false;
      this.use_button_checker = 0;
    }
  }
  openchest(actor) {
    var child = this.player.parent.getChildByName(actor.toString());
    let gun = instantiate(this.gun);
    // //console.log(child);
    if (this.player.parent.getChildByName(actor.toString()) != null) child.getChildByName("gun").addChild(gun);
  }
  openchat() {
    let chat = instantiate(this.chat_prefab);
    chat.setPosition(this.maincamera.getPosition());
    if (this.node.parent.getChildByName(chat.name) == null) {
      this.node.parent.addChild(chat);
      //console.log(this.photon_instance.totalmessages);

      this.node.parent.getChildByName(chat.name).getComponent(Message).allmessages();
    } else {
      this.node.parent.getChildByName(chat.name).scale = new Vec3(1, 1, 1);
      photonmanager.Instance.photon_instance.totalmessages = [];
    }
  }
  fire(angle) {
    let position = this.player.getChildByName("gun").getPosition();
    const WorldSpace = this.player.getChildByName("gun").getComponent(UITransform).convertToWorldSpaceAR(position); // 2
    const Position = this.player.getComponent(UITransform).convertToNodeSpaceAR(WorldSpace); // 3
    // //console.log(Position, position);
    this.createBullet(new Vec2(position.x, position.y), 10, angle); // 4
    this.photon_instance.raiseEvent(Photonevents.Fireatotheractors, {
      position: new Vec2(position.x, position.y),
      angle: angle,
    });
  }
  fireatotheractor(value) {
    this.createotherBullet(value.position, 10, value.angle, value.actorNr); // 4
  }
  kill_actor(actor) {
    this.killed_actor = actor.name;
    if (this.killed_actor != this.photon_instance.myActor().actorNr.toString()) {
      var child = this.player.parent.getChildByName(this.killed_actor);
      if (
        this.player.parent.getChildByName(this.killed_actor + "killedplayer") == null &&
        this.player.parent.getChildByName(this.killed_actor) != null
      ) {
        if (child.getComponent(Sprite).color.toRGBValue() != Color.GREEN.toRGBValue()) {
          let killed_sprites = instantiate(this.player_prefab);
          killed_sprites.name = this.killed_actor + "killedplayer";
          killed_sprites.getComponent(Sprite).spriteFrame = this.killed_sprite;
          killed_sprites.setPosition(actor.position);
          this.player.parent.addChild(killed_sprites);
          child.getComponent(Sprite).grayscale = true;
          this.kill_button_checker = 0;
          child.layer = 2;
          if (child.getChildByName("gun").children.length != 0) child.getChildByName("gun").children[0].destroy();
        } else {
          child.active = false;
          setTimeout(() => {
            child.active = true;
          }, 5000);
        }
      }
    }
  }
  zombie_actor(actor) {
    this.killed_actor = actor.name;
    //console.log(actor.name);
    if (this.killed_actor != this.photon_instance.myActor().actorNr.toString()) {
      var child = this.player.parent.getChildByName(this.killed_actor);
      if (
        this.player.parent.getChildByName(actor.name + "killedplayer") == null &&
        this.player.parent.getChildByName(actor.name) != null &&
        this.player.parent.getChildByName(actor.name).getComponent(Sprite).color != Color.GREEN
      ) {
        child.getComponent(Sprite).color = Color.GREEN;
        child.getComponent(BoxCollider2D).group = 1 << 2;
        child.getComponent(RigidBody2D).group = 1 << 2;
      }
    }
  }
  createBullet(position: Vec2, velocity: number, angle: number) {
    const newBullet = instantiate(this.bullet); // 1
    newBullet.setPosition(position.x, position.y, 0); // 2
    newBullet.angle = angle * -1;
    const body = newBullet.getComponent(RigidBody2D); // 3
    body.linearVelocity = new Vec2(sind(angle) * velocity, cosd(angle) * velocity);
    if (this.photon_instance.myActor().getCustomProperty("zombie")) {
      newBullet.getComponent(RigidBody2D).group = 2;
      newBullet.getComponent(BoxCollider2D).group = 2;
    }
    this.player.addChild(newBullet);
    this.player.updateWorldTransform(); // 4
  }
  createotherBullet(position: Vec2, velocity: number, angle: number, actorNr) {
    if (this.player.parent.getChildByName(actorNr) != null) {
      const newBullet = instantiate(this.bullet); // 1
      newBullet.name = actorNr.toString() + "bullet";
      newBullet.setPosition(position.x, position.y, 0); // 2
      newBullet.angle = angle * -1;
      const body = newBullet.getComponent(RigidBody2D); // 3
      body.linearVelocity = new Vec2(sind(angle) * velocity, cosd(angle) * velocity);
      if (this.player.parent.getChildByName(actorNr).getComponent(Sprite).color == Color.GREEN) {
        newBullet.getComponent(RigidBody2D).group = 2;
        newBullet.getComponent(BoxCollider2D).group = 2;
      }
      this.player.parent.getChildByName(actorNr).addChild(newBullet);
      this.player.parent.getChildByName(actorNr).updateWorldTransform(); // 4
    }
  }
  convertSecToMin() {
    let timeProperty = photonmanager.Instance.photon_instance.myRoom().getCustomProperty("timer");
    let convert = (timeProperty / 60).toString();
    let con = convert.split(".");
    con[1] = "0." + con[1];
    let tomin: number = Number(con[0]);
    let toSec: number = Math.floor(Number(con[1]) * 60);
    if (Number.isNaN(toSec)) {
      toSec = 0;
    }
    this.Min = tomin;
    this.Sec = toSec;
  }
  stopwatchTimer() {
    this.totalSec = this.Min * 60 + this.Sec;
    let timer = instantiate(this.timer);
    photonmanager.Instance.photon_instance.myRoom().setCustomProperty("timer", this.totalSec);

    //*****Converting Minutes into Seconds */
    this.convertSecToMin();
    let position = timer.getPosition();
    position.y = -440;
    timer.setPosition(position);
    this.node.parent.addChild(timer);
    this.Timer = this.node.parent.getChildByName("Timer");
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
      timeProperty--;
      photonmanager.Instance.photon_instance.myRoom().setCustomProperty("timer", timeProperty);
      this.convertSecToMin();
      let m = this.Min < 10 ? "0" + this.Min : this.Min;
      let s = this.Sec < 10 ? "0" + this.Sec : this.Sec;
      this.Timer.getComponent(Label).string = m.toString() + ":" + s.toString();
    }
  }
  updateOtherPlayerTimer() {
    this.convertSecToMin();
    let m = this.Min < 10 ? "0" + this.Min : this.Min;
    let s = this.Sec < 10 ? "0" + this.Sec : this.Sec;
    if (this.Timer.getComponent(Label)) {
      this.Timer.getComponent(Label).string = m.toString() + ":" + s.toString();
    }
  }
  addRigidBody() {
    // console.log("add rigid body ");

    this.node
      .getComponent(TiledMap)
      .getObjectGroup("interactables")
      .getObjects()
      .forEach((e) => {
        var node = new Node();
        this.intrectibleNode.addChild(node);
        let a: Rect = new Rect(e.x, e.y - e.height, 32, 32);
        let bb = this.intrectibleNode.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(a.x, a.y, 0));
        a = new Rect(bb.x, bb.y, e.width, e.height);
        // console.log("rect data ", a);

        node.setPosition(bb.x, bb.y);

        node.name = "game1";
        node.addComponent(UITransform);
        node.getComponent(UITransform).height = e.height;
        node.getComponent(UITransform).width = e.width;
        node.addComponent(RigidBody2D);
        node.getComponent(RigidBody2D).type = ERigidBody2DType.Static;
        node.getComponent(RigidBody2D).allowSleep = false;
        node.getComponent(RigidBody2D).awakeOnLoad = true;
        node.getComponent(RigidBody2D).gravityScale = 0;
        node.getComponent(RigidBody2D).allowSleep = true;
        let collider = node.addComponent(BoxCollider2D);
        // collider.size=
        // let collider = tile.addComponent(BoxCollider2D);
        // collider.size = tilesize;
        collider.density = 1000;
        collider.restitution = 0;
        collider.offset = new Vec2(0, 0);
        collider.apply();
        // console.log("new Node component  ", node);
      });
  }
  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    //collsion callback functions
    if (otherCollider.name == "game1") {
    }
  }
  update(deltaTime: number) {
    //functionality to check if the bounding box of player collides with an particular bounding box given in tilemap object groups
    let position = this.node.getComponent(UITransform).convertToNodeSpaceAR(this.player.getPosition());
    this.player_bb = new Rect(
      position.x + this.node.getComponent(UITransform).width * 0.5 - this.player.getComponent(UITransform).width * 0.5,
      position.y +
        this.node.getComponent(UITransform).height * 0.5 -
        this.player.getComponent(UITransform).height * 0.5,
      this.player.getComponent(UITransform).width,
      this.player.getComponent(UITransform).height
    );
    this.node
      .getComponent(TiledMap)
      .getObjectGroup("interactables")
      .getObjects()
      .forEach((e) => {
        let a: Rect = new Rect(e.x, e.y - e.height, 32, 32);
        let bb = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(a.x, a.y, 0));
        a = new Rect(bb.x, bb.y, e.width, e.height);
        /**@Boundingboxdebugging **/
        //console.log("a");

        // let b = instantiate(this.bounding_box);
        // this.node.addChild(b);
        // let ctx = this.node.getChildByName("boundingbox").getComponent(GraphicsComponent);
        // ctx.rect(bb.x, bb.y, e.width, e.height);
        // ctx.stroke();
        // let b1 = instantiate(this.bounding_box);
        // b1.name = "ab"
        // this.node.addChild(b1);
        // let ctx1 = this.node.getChildByName("ab").getComponent(GraphicsComponent);
        // ctx1.rect(this.player_bb.x, this.player_bb.y, this.player_bb.width, this.player_bb.height);
        // ctx1.stroke();

        if (this.player_bb.intersects(a)) {
          //console.log("logged");

          if (e!.prefab_type == "chest") {
            this.chest = true;

            this.chest_button.getComponent(Sprite).setEntityColor(new math.Color(0, 0, 0, 0.4));
            this.chest_button.getComponent(Button).interactable = true;

            this.chest_button_checker = 1;
          } else {
            this.minigame = instantiate(this.minigames[e!.prefab_name]);
            this.minigame.setPosition(this.maincamera.getPosition());
            this.use_button.getComponent(Sprite).setEntityColor(new math.Color(0, 0, 0, 0.4));
            this.use_button.getComponent(Button).interactable = true;
            this.use_button_checker = 1;
          }
        } else if (this.use_button_checker == 1) {
          if (!this.chest && e!.prefab_type != "chest" && this.minigame.name == this.minigames[e!.prefab_name]!.name) {
            this.use_button.getComponent(Button).interactable = false;
            //console.log("sajkfhdkslj");
          }
          if (this.chest == true && e!.prefab_type == "chest") {
            this.chest_button.getComponent(Button).interactable = false;
            this.chest = false;
          }
        }
      });
    this.player.parent.children.forEach((e) => {
      if (e.name != "player" && e.name != "chest" && e.name[1] != "k" && e.name != "bullet") {
        e.updateWorldTransform();
        let otherplayer = e.getComponent(UITransform).getBoundingBoxToWorld();
        this.player.updateWorldTransform();
        let myplayer = new Rect(
          this.player.getWorldPosition().x,
          this.player.getWorldPosition().y,
          this.player.getComponent(UITransform).width,
          this.player.getComponent(UITransform).height
        );
        if (myplayer.intersects(otherplayer)) {
          this.kill_button.getComponent(Button).interactable = true;
          this.killed_actor = e;
          this.kill_button_checker = 1;
        } else if (this.kill_button_checker == 1) {
          if (this.killed_actor.name == e.name) {
            this.kill_button.getComponent(Button).interactable = false;
          }
        }
      }
    });
    if (this.canfire) {
      if (this.intervaloffire % this.rateoffire == 0) {
        this.fire((this.anlges - 90) * -1);
      }
      this.intervaloffire++;
    }
    if ((this.Min == 0 && this.Sec == 0) || this.photon_instance.myRoom().getCustomProperty("liveplayers") == 4) {
      let gameover = instantiate(this.gameovernode);
      if (this.node.parent.getChildByName(gameover.name) == null) {
        this.node.parent.addChild(gameover);
        setTimeout(() => {
          this.node.parent.getChildByName("gameover").getComponent(GameOver).GetWinner(0, 1, 1);
          this.photon_instance.leaveRoom();
        }, 1000);
        photonmanager.Instance.GameStartStatus = false;
        this.photon_instance.joined = false;
        this.photon_instance.myActor().setCustomProperty("zombie", false);
      }
    } else if (
      this.photon_instance.myRoom().getCustomProperty("Minigame1") &&
      this.photon_instance.myRoom().getCustomProperty("Minigame2") &&
      this.photon_instance.myRoom().getCustomProperty("Minigame3")
    ) {
      // director.loadScene("GameOver", () => { });

      let gameover = instantiate(this.gameovernode);
      if (this.node.parent.getChildByName(gameover.name) == null) {
        this.node.parent.addChild(gameover);
        setTimeout(() => {
          this.node.parent.getChildByName("gameover").getComponent(GameOver).GetWinner(1, 1, 1);
          this.photon_instance.leaveRoom();
        }, 1000);
        photonmanager.Instance.GameStartStatus = false;
        this.photon_instance.joined = false;
        this.photon_instance.myActor().setCustomProperty("zombie", false);
      }
    }
  }
}
