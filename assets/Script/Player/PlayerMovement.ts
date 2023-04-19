import { _decorator, Component, Node, UITransform, Vec3, Vec2, Animation, ImageAsset, SpriteFrame, Sprite, PhysicsSystem, PhysicsSystem2D, AudioClip, AudioSourceComponent, Collider2D, Contact2DType, IPhysics2DContact, Camera, log, EPhysics2DDrawFlags, TiledMap, instantiate, Prefab, randomRangeInt, RigidBody, RigidBody2D, BoxCollider2D, CircleCollider2D, v3, math } from "cc";
import { Room } from "../../../extensions/colyseus-sdk/runtime/colyseus";
import { Event } from "../photon/photonconstants"
import { walls } from "../wallscollisions";
import { photonmanager } from "../photon/photonmanager";
import photon from "../photon/photon";
const { ccclass, property } = _decorator;




@ccclass("PlayerMovement")
export class PlayerMovement extends Component {
    @property({ type: SpriteFrame })
    playerImage: SpriteFrame = null;
    @property({ type: SpriteFrame })
    killed_player_image: SpriteFrame = null;
    @property({ type: Node })
    joystick: Node = null;
    @property({ type: Node })
    joyStickBall: Node = null;
    @property({ type: Node })
    camera: Node = null;
    @property({ type: Node })
    controller: Node = null;
    @property({ type: Node })
    map: Node = null;
    @property({ type: Prefab })
    player_prefab: Prefab = null
    pos: Vec2 = null;
    startPos: Vec3 = null;
    intialPos: Vec3 = null;
    finalPosBall: Vec3 = null;
    finalPos: Vec3 = null;
    canMovePlayer: boolean = false;
    collided: boolean = false;
    collisionangle: number = null
    playerSpeed: number = 0.1
    touchenabled: boolean = true;
    count: number = 0;
    anlges: number = 0
    actors: any;
    photon_instance
    start() {
        this.touchEventsFunc();
        PhysicsSystem2D.instance.enable = true;
        if (PhysicsSystem2D.instance) {//physics handler to check for collsions
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, () => { this.collided = false; }, this);
        }
        this.photon_instance.myActor().setCustomProperty("position", this.node.getPosition());

    }
    onLoad() {
        this.finalPosBall = new Vec3(1, 1, 0);
        this.finalPos = this.node.getPosition();
        this.intialPos = new Vec3(1, 1, 0);
        this.startPos = this.joyStickBall.getPosition();
        this.photon_instance = photonmanager.getInstance().photon_instance;
        this.photon_instance.player_movements = this;
        this.addedactor(this.photon_instance.myActor());
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {//collsion callback functions

        if (otherCollider.node.name == "bullet") {
            otherCollider.node.destroy()
            // otherCollider.node.name

        }
        console.log(otherCollider.node.name.slice(1), selfCollider.node.name, otherCollider.node.name);

        if (otherCollider.node.name.slice(1) == "bullet" && selfCollider.node.name[0] != otherCollider.node.name[0]) {
            otherCollider.node.destroy();
            console.log(true);

        }

        else if (otherCollider.node.name == "player" && selfCollider.node.name[0] == otherCollider.node.name[0]) {
            this.node.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0);
            selfCollider.restitution = 0;
            otherCollider.restitution = 0;
            // this.collided = true;
            console.log("abcde");

            otherCollider.node.getComponent(Animation).pause();
        } else if (otherCollider.node.name == "player" && selfCollider.node.name[0] != otherCollider.node.name[0] && selfCollider.node.name.slice(1) == "bullet") {
            console.log(selfCollider.node);
            selfCollider.node.destroy()
        }

    }
    touchEventsFunc() {//touch events handler
        this.joyStickBall.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.joyStickBall.on(Node.EventType.TOUCH_MOVE, (e) => {
            if (this.touchenabled) {
                this.touchMove(e)
            }
            else {
                this.touchEnd();
            }
        }, this);

        this.joyStickBall.on(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.joyStickBall.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }
    touchEnd() {
        this.canMovePlayer = false;
        this.joyStickBall.setPosition(0, 0, 0);
        this.photon_instance.myActor().setCustomProperty("angle", null);
        this.node.getComponent(Animation)?.pause();
        this.node.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0)

    }
    touchStart() {
        this.joyStickBall.setPosition(0, 0, 0);
        this.touchenabled = true;
        this.canMovePlayer = true;
    }
    checkperspective() {
        this.node.parent.children.forEach((e) => {
            if (this.node.getPosition().y > e.getPosition().y) {
                console.log(this.node.getPosition().y);

                this.node.setSiblingIndex(0);
            }

        })
    }
    touchMove(e) {

        //functionality to check if the touch is wihtin the limit for the joystick to be enabled
        let first_touch = this.controller.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(e.getUILocation().x, e.getUILocation().y, e.getUILocation().z))
        let final_touch = new Vec2(this.startPos.x - first_touch.x, this.startPos.y - first_touch.y)
        let width_check = new Vec3(this.controller.parent.getComponent(UITransform).width / 2 - this.controller.getComponent(UITransform).width / 2, this.controller.parent.getComponent(UITransform).height / 2 - this.controller.getComponent(UITransform).width / 2, 0)
        if (final_touch.length() > width_check.length()) {
            this.touchenabled = false
            this.touchEnd();
        }
        let y = e.touch.getUILocationY();
        let x = e.touch.getUILocationX();
        var len = this.intialPos.length();
        var joyStickBallBaseWidth = this.controller.getComponent(UITransform).getBoundingBox().width / 2;
        let worldPosition = new Vec3(x, y, 0);
        let localPosition = v3();
        this.controller.inverseTransformPoint(localPosition, worldPosition);
        let thumbnailPosition = v3();
        let lens = localPosition.length();
        localPosition.normalize();
        let radius = this.intialPos.x * joyStickBallBaseWidth / len;
        Vec3.scaleAndAdd(thumbnailPosition, v3(), localPosition, math.clamp(lens, 0, 60));
        var dy = thumbnailPosition.y;
        var dx = thumbnailPosition.x;
        console.log(thumbnailPosition);
        var angleRad = Math.atan2(dy, dx);
        var angleDeg = (angleRad * 180) / Math.PI;
        this.joyStickBall.setPosition(thumbnailPosition);
        this.intialPos = thumbnailPosition
        if (angleDeg < 0) {
            this.anlges = angleDeg + 360;//convert angle to positive
        }
        else {
            this.anlges = angleDeg;
        }
        this.getDirection(this.node, this.anlges);
        this.photon_instance.raiseEvent(Event.Animation, this.anlges, {});
    }
    getDirection(node, angle) {
        console.log("config");
        //handling animations according to     joystick movement
        if (angle > 335 && angle < 359 || angle < 25 && angle > 0) {
            this.playWalkAnmation(node, "East");
        } else if (angle > 25 && angle < 75) {
            this.playWalkAnmation(node, "North_East");
        } else if (angle > 75 && angle < 125) {
            this.playWalkAnmation(node, "North");
        } else if (angle > 125 && angle < 155) {
            this.playWalkAnmation(node, "North_West");
        } else if (angle > 155 && angle < 215) {
            this.playWalkAnmation(node, "West");
        } else if (angle > 215 && angle < 255) {
            this.playWalkAnmation(node, "South_West");
        } else if (angle > 245 && angle < 315) {
            this.playWalkAnmation(node, "South");
        }
        else {
            this.playWalkAnmation(node, "South_East");
        }
    }
    // 


    playWalkAnmation(node, walkDirection: String) {



        switch (walkDirection) {
            case "North":
                {
                    node.getComponent(Animation)?.play("north");
                }
                break;
            case "East":
                {
                    node.getComponent(Animation)?.play("east");
                }
                break;
            case "South":
                {
                    node.getComponent(Animation)?.play("south");
                }
                break;
            case "West":
                {
                    node.getComponent(Animation)?.play("west");
                }
                break;
            case "North_East":
                {
                    node.getComponent(Animation)?.play("northEast");
                }
                break;
            case "North_West":
                {
                    node.getComponent(Animation)?.play("northWest");
                }
                break;
            case "South_East":
                {
                    node.getComponent(Animation)?.play("southEast");
                }
                break;
            case "South_West":
                {
                    node.getComponent(Animation)?.play("southWest");
                }
                break;
        }
    }
    addedactor(actor: any) {
        var actors = Object.keys(this.photon_instance.myRoomActors()).map(key => {
            return this.photon_instance.myRoomActors()[key];
        })
        actors.forEach((actor) => {
            if (actor.actorNr != this.photon_instance.myActor().actorNr && !this.node.parent.getChildByName(actor.actorNr.toString())) {
                console.log(actor.actorNr);
                let player = instantiate(this.player_prefab)
                player.name = actor.actorNr.toString()
                this.node.parent.addChild(player);
            }
        })
        console.log(this.photon_instance.myRoomActors());

    }
    move_actor(actor: any) {
        if (actor.actorNr != this.photon_instance.myActor().actorNr) {

            var child = this.node.parent.getChildByName(actor.actorNr.toString())
            child.setPosition(actor.getCustomProperty("position"))
        }

    }
    kill_otheractor(actor: any) {
        if (actor.name != this.photon_instance.myActor().actorNr.toString()) {


            if (this.node.parent.getChildByName(actor.name + "killedplayer"
            ) == null) {
                console.log(actor.name);
                var child = this.node.parent.getChildByName(actor.name)
                let killed_sprites = instantiate(this.player_prefab);
                killed_sprites.name = actor.name + "killedplayer"
                killed_sprites.setPosition(actor.position)
                killed_sprites.getComponent(Sprite).spriteFrame = this.killed_player_image;
                killed_sprites.setScale(new Vec3(0.2, 0.2, 0));
                this.node.parent.addChild(killed_sprites);
                child.layer = 2;
                child.getComponent(Sprite).grayscale = true
            }


        }
        else {
            var child = this.node.parent.getChildByName(actor.name
            )
            if (this.node.parent.getChildByName(actor.name + "killedplayer"
            ) == null) {
                let killed_sprites = instantiate(this.player_prefab);
                killed_sprites.name = actor.name + "killedplayer"
                killed_sprites.setPosition(actor.position)
                killed_sprites.getComponent(Sprite).spriteFrame = this.killed_player_image;
                killed_sprites.setScale(new Vec3(0.2, 0.2, 0));
                this.node.parent.addChild(killed_sprites);
                this.node.getComponent(Sprite).grayscale = true
                this.node.layer = 2;
                this.camera.getComponent(Camera).visibility = 3;
                this.node.getComponent(CircleCollider2D).enabled = false;
            }

        }
    }
    enableanimation(actorNr: number, content: any) {
        var child = this.node.parent.getChildByName(actorNr.toString())
        this.getDirection(child, content)
    }
    destroycharacter(actor: Photon.LoadBalancing.Actor) {
        var child = this.node.parent.getChildByName(actor.actorNr.toString())
        child.destroy();
    }
    update(deltaTime: number) {
        if (this.canMovePlayer) {
            this.node.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0)
            this.node.getComponent(RigidBody2D).linearVelocity = new Vec2(this.intialPos.x * this.playerSpeed, this.intialPos.y * this.playerSpeed)
            this.photon_instance.myActor().setCustomProperty("position", this.node.getPosition());
        }
        let playerPosition = new Vec3();
        playerPosition = this.node.getPosition();
        this.node.angle = 0;
        this.node.getComponent(RigidBody2D).angularVelocity = 0
        this.camera.setPosition(playerPosition.x + this.camera.parent.getComponent(UITransform).width * 0.1, playerPosition.y + this.camera.parent.getComponent(UITransform).height * 0.3);//code for camera movements
    }
}




