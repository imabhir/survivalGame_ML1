import { _decorator, Component, Node, UITransform, Vec3, Vec2, Animation, ImageAsset, SpriteFrame, Sprite, PhysicsSystem, PhysicsSystem2D, AudioClip, AudioSourceComponent, Collider2D, Contact2DType, IPhysics2DContact, Camera, log, EPhysics2DDrawFlags, TiledMap, instantiate, Prefab, randomRangeInt, RigidBody, RigidBody2D } from "cc";
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
    playerSpeed: number = 0.04
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
        this.addedactor(this.photon_instance.myActor())



    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {//collsion callback functions
        if (otherCollider.node.name == "player") {
            this.node.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0);
            selfCollider.restitution = 0;
            otherCollider.restitution = 0;
            this.collided = true;
        }
        otherCollider.node.getComponent(Animation).pause();
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
        //if the player is not collided then functionality to move player 
        if (!this.collided) {
            this.intialPos = this.controller
                .getComponent(UITransform)
                .convertToNodeSpaceAR(new Vec3(e.getUILocation().x, e.getUILocation().y, e.getUILocation().z));//controller node is passed as an property to get its height and width such that the cameras motion doesnt effect the position
            var len = this.intialPos.length();
            var joyStickBallBaseWidth = this.controller.getComponent(UITransform).getBoundingBox().width / 2;
            if (len > joyStickBallBaseWidth) {//to check if the joystickball is within the length of the joystick
                this.intialPos.x = (this.intialPos.x * joyStickBallBaseWidth) / len;
                this.intialPos.y = (this.intialPos.y * joyStickBallBaseWidth) / len;
            }
            var dy = this.intialPos.y;
            var dx = this.intialPos.x;
            var angleRad = Math.atan2(dy, dx);
            var angleDeg = (angleRad * 180) / Math.PI;
            this.handlecollision(angleDeg);
            this.joyStickBall.setPosition(this.intialPos);
            if (angleDeg < 0) {
                this.anlges = angleDeg + 360;//convert angle to positive
            }
            else {
                this.anlges = angleDeg;
            }
            this.getDirection(this.node, this.anlges);
            // this.photon_instance.myActor().setCustomProperty("angle", this.anlges);

            this.photon_instance.raiseEvent(Event.Animation, this.anlges, {});
        }
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
    handlecollision(angle) {//function to block the particular part of joystick on collisions

        if (this.anlges < (this.collisionangle - 25) || this.anlges > (this.collisionangle + 25)) {
            this.playerSpeed = 0.04
            this.count = 0;
            this.collided = false
        }
    }
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
    enableanimation(actorNr: number, content: any) {
        var child = this.node.parent.getChildByName(actorNr.toString())
        this.getDirection(child, content)
    }
    destroycharacter(actor: Photon.LoadBalancing.Actor) {
        var child = this.node.parent.getChildByName(actor.actorNr.toString())
        child.destroy();
    }
    update(deltaTime: number) {
        // this.checkperspective();
        if (this.canMovePlayer) {//player position setting for providing in lerp function
            this.pos = new Vec2(this.startPos.x - this.intialPos.x, this.startPos.y - this.intialPos.y);
            if (this.collided) { }
            if (!this.collided) {
                this.finalPos.x -= this.pos.x * this.playerSpeed;
                this.finalPos.y -= this.pos.y * this.playerSpeed;
            }
            else {
                this.finalPos = this.node.getPosition();
            }
            this.photon_instance.myActor().setCustomProperty("position", this.node.getPosition());
            this.pos.x = 0;
            this.pos.y = 0;
        }
        let currentPostion = this.node.getPosition();
        let playerPosition = new Vec3();
        if (this.collided && this.count == 0) {
            //condition to handle collisions for an particular angle only
            if ((this.anlges < 295 && this.anlges > 245) || (this.anlges < 25 || this.anlges > 345) || (this.anlges > 75 && this.anlges < 115) || (this.anlges > 155 && this.anlges < 215)) {
                this.collisionangle = this.anlges;

                this.playerSpeed = 0;
                this.count = 1;

            }
        }
        if (this.collided) {//condition to stop lerp function on collision            
            this.finalPos = currentPostion; this.pos = new Vec2(0, 0); this.collided = false; console.log(this.canMovePlayer, "hell ya");

        }
        Vec3.lerp(playerPosition, currentPostion, this.finalPos, 0.06);
        this.node.setPosition(playerPosition);
        this.camera.setPosition(playerPosition.x + this.camera.parent.getComponent(UITransform).width * 0.1, playerPosition.y + this.camera.parent.getComponent(UITransform).height * 0.3);//code for camera movements
    }
}




