import { _decorator, Component, Node, TiledMap, PhysicsSystem2D, Contact2DType, Collider2D, IPhysics2DContact, Rect, UITransform, TiledObjectGroup, Vec3, TiledLayer, TiledTile, RigidBody, RigidBody2D, RigidBodyComponent, BoxCollider2D, Vec2, ERigidBody2DType, PhysicsSystem, EPhysics2DDrawFlags, director, Prefab, instantiate, GraphicsComponent, rect, log, Input, TiledMapAsset, Button, Sprite, Event, EventHandler, math, randomRangeInt, SpriteFrame, Skeleton, sp, Socket, input, Quat, CircleCollider2D, Color } from 'cc';
import { photonmanager } from './photon/photonmanager';
import { Photonevents } from './photon/cloud-app-info';
const { ccclass, property } = _decorator;
import { PlayerMovement } from './Player/PlayerMovement'
import { Message } from './ChatScript/Message';






const { cos, sin, PI } = Math

const rad = deg => deg * PI / 180;
const cosd = deg => cos(rad(deg));
const sind = deg => sin(rad(deg));
@ccclass('walls')
export class walls extends Component {
    @property({ type: Node })
    player: Node = null
    @property({ type: Prefab })
    player_prefab: Prefab = null
    @property({ type: Prefab })
    bounding_box: Prefab = null
    @property({ type: Prefab })
    minigames: Node[][] = []
    @property({ type: Node })
    camera: Node = null
    @property({ type: Node })
    maincamera: Node = null
    @property({ type: Node })
    use_button: Node = null
    @property({ type: Node })
    kill_button: Node = null
    @property({ type: SpriteFrame })
    killed_sprite: SpriteFrame = null
    @property({ type: Node })
    chest_button: Node = null
    @property({ type: Prefab })
    chest_prefab: Prefab = null
    @property({ type: Prefab })
    chat_prefab: Prefab = null
    @property({ type: Prefab })
    gun: Prefab = null
    @property({ type: Prefab })
    bullet: Prefab = null
    @property({ type: Node })
    joystick: Node = null;
    @property({ type: Node })
    joyStickBall: Node = null;
    @property({ type: Node })
    controller: Node = null;
    player_bb: Rect
    count = 0;
    map: any
    use_button_checker: number = 0;
    minigame: Node;
    demo: Photon.LoadBalancing.LoadBalancingClient;
    actors = 0;
    kill_button_checker: number = 0;
    kill_actor_name: string;
    photon_instance: any;
    killed_actor: any;
    chat: any = false;
    chest: boolean = false;
    chest_button_checker: number = 0;
    canmoveweapon: boolean;
    intialPos: Vec3 = null;
    finalPosBall: Vec3 = null;
    startPos: Vec3 = null;
    anlges: number;
    canfire: boolean = false;
    intervaloffire: number = 0;
    rateoffire: number = 20;
    onLoad() {
        PhysicsSystem2D.instance.enable = true;
        this.map = this.node.getComponent(TiledMap)
        // console.log(this.node.getComponent(TiledMap).getObjectGroups())
        this.camera.setPosition(this.maincamera.getPosition())

        this.use_button.getComponent(Button).interactable = false
        this.kill_button.getComponent(Button).interactable = false
        this.chest_button.getComponent(Button).interactable = false


        this.photon_instance = photonmanager.getInstance().photon_instance;



        this.photon_instance.wallclass = this
        this.finalPosBall = new Vec3(1, 1, 0);
        this.intialPos = new Vec3(1, 1, 0);
        this.startPos = this.joyStickBall.getPosition();





        this.touchEventsFunc()
    }
    start() {//refer to link https://juejin.cn/post/7068114266716373029
        this.enablecollision("level1")
        // console.log("logged");
        this.setUpConnection();
        this.node.getComponent(TiledMap).getObjectGroup("interactables").getObjects().forEach((e) => {
            if (e!.prefab_type == "chest") {
                let chest = instantiate(this.chest_prefab)
                let position = this.player.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(e.x, e.y, 0))
                chest.setPosition(position.x + e.width * 0.5, position.y + e.height * 0.5)
                this.player.parent.addChild(chest)
            }
        })
    }
    setUpConnection() {
    }
    touchEventsFunc() {//touch events handler
        this.joyStickBall.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.joyStickBall.on(Node.EventType.TOUCH_MOVE,
            (e) => { this.touchMove(e) }, this);
        this.joyStickBall.on(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.joyStickBall.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }
    touchEnd() {
        this.joyStickBall.setPosition(0, 0, 0);
        this.canmoveweapon = false;
        this.canfire = false

    }
    touchStart() {
        this.joyStickBall.setPosition(0, 0, 0);
        this.canmoveweapon = true;
        // console.log("abcde");
    }
    touchMove(e) {
        this.intialPos = this.controller
            .getComponent(UITransform)
            .convertToNodeSpaceAR(new Vec3(e.getUILocation().x, e.getUILocation().y, e.getUILocation().z));//controller node is passed as an property to get its height and width such that the cameras motion doesnt effect the position
        var len = this.intialPos.length();
        var joyStickBallBaseWidth = this.controller.getComponent(UITransform).getBoundingBox().width / 2;
        if (len > joyStickBallBaseWidth) {
            //to check if the joystickball is within the length of the joystick
            this.intialPos.x = (this.intialPos.x * joyStickBallBaseWidth) / len;
            this.intialPos.y = (this.intialPos.y * joyStickBallBaseWidth) / len;


            // console.log(this.anlges);
            this.canfire = true
            // console.log(this.player.getChildByName("gun"));

            // let sockets = this.player.getComponent(sp.Skeleton)
            // let target = sockets.sockets[1].target
            // console.log(target);


        }
        var dy = this.intialPos.y;
        var dx = this.intialPos.x;
        var angleRad = Math.atan2(dy, dx);
        var angleDeg = (angleRad * 180) / Math.PI;
        this.joyStickBall.setPosition(this.intialPos);
        if (angleDeg < 0) {
            this.anlges = angleDeg + 360;//convert angle to positive
        }
        else {
            this.anlges = angleDeg;
        }
        // console.log(this.anlges);
        this.player.getChildByName("gun").angle = (this.anlges)
        this.player.getComponent(PlayerMovement).getDirection(this.player, this.anlges)
        // this.anlges = angleDeg < 0 ? angleDeg - 180 : angleDeg + 90
    }
    enablecollision(name) {
        let layer: TiledLayer = this.map.getLayer(name)


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
                    let collider = tile.addComponent(BoxCollider2D);
                    collider.size = tilesize;
                    collider.density = 1000;
                    collider.restitution = 0;
                    collider.offset = new Vec2(tilesize.width / 2, tilesize.height / 2)
                    collider.apply();
                }
            }
        }
    }
    open() {
        if (this.chest) {
            // console.log("opened");
            let gun = instantiate(this.gun);
            this.player.getChildByName("gun").addChild(gun);
            this.player.updateWorldTransform(); // 4



            // let Skeleton = this.player.getComponent(sp.Skeleton
            // )
            // console.log(Skeleton);

            // let socket = new sp.SpineSocket("Crab/Body/Crab_Leg_1/Crab_Leg_2", this.player.getChildByName("gun"))
            // Skeleton.sockets.push(socket)
            // Skeleton!.sockets = Skeleton!.sockets;
            this.chest = false
            this.chest_button_checker = 0;
            this.kill_button.getComponent(Button).interactable = false
            this.photon_instance.raiseEvent(Photonevents.Openchest, {});
        }
        else {
            if (this.node.parent.getChildByName(this.minigame.name) == null) {
                console.log(this.minigame.name);
                this.node.parent.addChild(this.minigame)
            }
            // console.log("b");
            this.use_button.getComponent(Button).interactable = false
            this.use_button_checker = 0;
        }

    }
    openchest(actor) {

        var child = this.player.parent.getChildByName(actor.toString())
        let gun = instantiate(this.gun);
        // console.log(child);
        child.getChildByName("gun").addChild(gun);



        // let Skeleton = child.getComponent(sp.Skeleton
        // )
        // let socket = new sp.SpineSocket("Crab/Body/Crab_Leg_1/Crab_Leg_2", child.getChildByName("gun"))
        // Skeleton.sockets.push(socket)
        // Skeleton!.sockets = Skeleton!.sockets;
        // console.log(Skeleton);


    }
    openchat() {
        let chat = instantiate(this.chat_prefab);
        chat.setPosition(this.maincamera.getPosition());
        if (this.node.parent.getChildByName(chat.name) == null) {
            this.node.parent.addChild(chat)
            console.log(this.photon_instance.totalmessages);

            this.node.parent.getChildByName(chat.name).getComponent(Message).allmessages();
        }
        else {
            this.node.parent.getChildByName(chat.name).scale = new Vec3(1, 1, 1);
        }
    }
    fire(angle) {
        // if (this.player.parent.getChildByName(this.killed_actor.name + "killedplayer"
        // ) == null) {
        let position = this.player.getChildByName("gun").getPosition();

        const WorldSpace = this.player.getChildByName("gun").getComponent(UITransform).convertToWorldSpaceAR(position) // 2
        const Position = this.player.getComponent(UITransform).convertToNodeSpaceAR(WorldSpace) // 3
        // console.log(Position, position);

        this.createBullet(new Vec2(position.x, position.y), 10, angle) // 4
        this.photon_instance.raiseEvent(116, { position: new Vec2(position.x, position.y), angle: angle })




    }
    fireatotheractor(value) {
        // if (this.player.parent.getChildByName(this.killed_actor.name + "killedplayer"
        // ) == null) {













        this.createotherBullet(value.position, 10, value.angle, value.actorNr) // 4





    }
    kill_actor(actor) {



        this.killed_actor = actor.name;
        if (this.killed_actor != this.photon_instance.myActor().actorNr.toString()) {
            var child = this.player.parent.getChildByName(this.killed_actor)
            if (this.player.parent.getChildByName(this.killed_actor + "killedplayer"
            ) == null) {
                let killed_sprites = instantiate(this.player_prefab);
                killed_sprites.name = this.killed_actor + "killedplayer"
                killed_sprites.getComponent(Sprite).spriteFrame = this.killed_sprite;
                console.log(actor.position.x);

                killed_sprites.setPosition(actor.position)
                killed_sprites.setScale(new Vec3(0.2, 0.3, 0.5));
                this.player.parent.addChild(killed_sprites);
                console.log(killed_sprites
                );

                child.getComponent(Sprite).grayscale = true
                // this.photon_instance.raiseEvent(113, { name: this.killed_actor, position: this.killed_actor.getPosition() });
                this.kill_button_checker = 0;
                console.log(this.killed_actor.layer);

                child.layer = 2;
                console.log(this.killed_actor.layer);

            }
        }
    }
    createBullet(position: Vec2, velocity: number, angle: number) {
        const newBullet = instantiate(this.bullet) // 1
        newBullet.setPosition(position.x, position.y, 0) // 2
        newBullet.angle = angle * -1

        const body = newBullet.getComponent(RigidBody2D) // 3
        body.linearVelocity = new Vec2(sind(angle) * velocity,
            cosd(angle) * velocity)
        if (this.photon_instance.myActor().getCustomProperty("zombie")) {
            newBullet.getComponent(RigidBody2D).group = 2;
            newBullet.getComponent(BoxCollider2D).group = 2;

        }
        this.player.addChild(newBullet)
        this.player.updateWorldTransform(); // 4
    }
    createotherBullet(position: Vec2, velocity: number, angle: number, actorNr) {
        if (this.player.parent.getChildByName(actorNr) != null) {
            const newBullet = instantiate(this.bullet) // 1
            // newBullet.getComponent(BoxCollider2D).enabled = false

            newBullet.name = actorNr.toString() + "bullet"
            // console.log(newBullet);
            newBullet.setPosition(position.x, position.y, 0) // 2
            newBullet.angle = angle * -1

            const body = newBullet.getComponent(RigidBody2D) // 3
            body.linearVelocity = new Vec2(sind(angle) * velocity,
                cosd(angle) * velocity)
            if (this.player.parent.getChildByName(actorNr).getComponent(Sprite).color == Color.GREEN) {
                newBullet.getComponent(RigidBody2D).group = 2;
                newBullet.getComponent(BoxCollider2D).group = 2;
            }
            this.player.parent.getChildByName(actorNr).addChild(newBullet)
            this.player.parent.getChildByName(actorNr).updateWorldTransform(); // 4






        }
    }
    update(deltaTime: number) {
        //functionality to check if the bounding box of player collides with an particular bounding box given in tilemap object groups
        let position = this.node.getComponent(UITransform).convertToNodeSpaceAR(this.player.getPosition());
        this.player_bb = new Rect(position.x + this.node.getComponent(UITransform).width * 0.5 - this.player.getComponent(UITransform).width * 0.5, position.y + this.node.getComponent(UITransform).height * 0.5 - this.player.getComponent(UITransform).height * 0.5, this.player.getComponent(UITransform).width, this.player.getComponent(UITransform).height)
        this.node.getComponent(TiledMap).getObjectGroup("interactables").getObjects().forEach((e) => {
            let a: Rect = new Rect(e.x, e.y - e.height, 32, 32)
            let bb = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(a.x, a.y, 0));
            a = new Rect(bb.x, bb.y, e.width, e.height)
            /**@Boundingboxdebugging **/

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

                if (e!.prefab_type == "chest") {
                    this.chest = true;


                    this.chest_button.getComponent(Sprite).setEntityColor(new math.Color(0, 0, 0, 0.4));
                    this.chest_button.getComponent(Button).interactable = true



                    this.chest_button_checker = 1

                } else {

                    this.minigame = instantiate(this.minigames[e!.prefab_name]);
                    this.minigame.setPosition(this.maincamera.getPosition());
                    // this.node.getChildByName("level1").active = false


                    // this.node.getChildByName("level2").active = true
                    // this.enablecollision("level2")

                    this.use_button.getComponent(Sprite).setEntityColor(new math.Color(0, 0, 0, 0.4));
                    this.use_button.getComponent(Button).interactable = true
                    // this.use_button.getComponent(Button).enabled = false
                    // var clickEventHandler = new EventHandler();
                    // clickEventHandler.target = this.node; //This node is the node to which your event handler code component belongs
                    // clickEventHandler.component = "walls";//This is the code file name
                    // clickEventHandler.handler = "open";


                    // this.use_button.getComponent(Button).clickEvents.push(clickEventHandler)
                    this.use_button_checker = 1
                }
            }
            else if (this.use_button_checker == 1) {
                if (!this.chest && e!.prefab_type != "chest" && this.minigame.name == this.minigames[e!.prefab_name]!.name) {
                    this.use_button.getComponent(Button).interactable = false
                }
                else if (this.chest == true && e!.prefab_type == "chest") {
                    this.chest_button.getComponent(Button).interactable = false
                    this.chest = false
                }
            }
            // if (this.actors != this.data.countofactors && this.data.countofactors > 1) {
            //     if (this.actors < this.data.countofactors) {
            //         let n = this.data.countofactors - this.node.getChildByName("player").children.length;
            //         for (let intervaloffire = 0; intervaloffire < n; intervaloffire++) {
            //             let b = instantiate(this.player_prefab)
            //             b.setPosition(b.getPosition().x - randomRangeInt(50, 200), b.getPosition().y - randomRangeInt(50, 300))
            //             this.node.getChildByName("player").addChild(b);
            //             console.log(b);

            //             this.actors++;
            //         }
            //     }
            // }
        })
        this.player.parent.children.forEach((e) => {


            if (e.name != "player" && e.name != "chest" && e.name[1] != "k" && e.name != "bullet") {
                e.updateWorldTransform()
                let otherplayer = e.getComponent(UITransform).getBoundingBoxToWorld();
                this.player.updateWorldTransform()
                let myplayer = new Rect(this.player.getWorldPosition().x, this.player.getWorldPosition().y, this.player.getComponent(UITransform).width, this.player.getComponent(UITransform).height)
                if (myplayer.intersects(otherplayer)) {
                    this.kill_button.getComponent(Button).interactable = true;
                    this.killed_actor = e
                    this.kill_button_checker = 1;
                }
                else if (this.kill_button_checker == 1) {
                    if (this.killed_actor.name == e.name) {
                        this.kill_button.getComponent(Button).interactable = false
                    }
                }
            }
        })
        if (this.canfire) {
            if (this.intervaloffire % this.rateoffire == 0) { this.fire((this.anlges - 90) * -1) }
            this.intervaloffire++;
        }
    }
}
