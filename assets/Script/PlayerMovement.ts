import { _decorator, Component, Node, UITransform, Vec3, Vec2, Animation, ImageAsset, SpriteFrame, Sprite, PhysicsSystem, PhysicsSystem2D, AudioClip, AudioSourceComponent, Collider2D, Contact2DType, IPhysics2DContact, Camera, log } from "cc";
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
    hud: Node = null;
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
    start() {
        this.touchEventsFunc();
        PhysicsSystem2D.instance.enable = true;
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, () => { this.collided = false; }, this);
        }
    }
    onLoad() {
        this.finalPosBall = new Vec3(1, 1, 0);
        this.finalPos = this.node.getPosition();
        this.intialPos = new Vec3(1, 1, 0);
        this.startPos = this.joyStickBall.getPosition();
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log(selfCollider.node.name);
        if (otherCollider.node.name == "player") {
            this.collided = true;
        }
    }
    touchEventsFunc() {
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
    }
    touchStart() {
        this.joyStickBall.setPosition(0, 0, 0);
        this.touchenabled = true;
        this.canMovePlayer = true;
    }
    touchMove(e) {
        let first_touch = this.hud
            .getComponent(UITransform)
            .convertToNodeSpaceAR(new Vec3(e.getUILocation().x, e.getUILocation().y, e.getUILocation().z))
        let final_touch = new Vec2(this.startPos.x - first_touch.x, this.startPos.y - first_touch.y)
        let width_check = new Vec3(this.hud.parent.getComponent(UITransform).width / 2 - this.hud.getComponent(UITransform).width / 2, this.hud.parent.getComponent(UITransform).height / 2 - this.hud.getComponent(UITransform).width / 2, 0)
        if (final_touch.length() > width_check.length()) {
            this.touchenabled = false
            this.touchEnd();
        }
        if (!this.collided) {
            this.intialPos = this.hud
                .getComponent(UITransform)
                .convertToNodeSpaceAR(new Vec3(e.getUILocation().x, e.getUILocation().y, e.getUILocation().z));
            var len = this.intialPos.length();
            var joyStickBallBaseWidth = this.hud.getComponent(UITransform).getBoundingBox().width / 2;
            if (len > joyStickBallBaseWidth) {
                this.intialPos.x = (this.intialPos.x * joyStickBallBaseWidth) / len;
                this.intialPos.y = (this.intialPos.y * joyStickBallBaseWidth) / len;
            }
            var dy = this.intialPos.y;
            var dx = this.intialPos.x;
            var angleRad = Math.atan2(dy, dx);
            var angleDeg = (angleRad * 180) / Math.PI;
            this.getDirection(angleDeg);
            this.handlecollision(angleDeg);
            this.joyStickBall.setPosition(this.intialPos);
            if (angleDeg < 0) {
                this.anlges = angleDeg + 360;
            }
            else {
                this.anlges = angleDeg;
            }
        }
    }
    getDirection(angle) {
        if (this.anlges < 90 || this.anlges > 270) {
            this.playWalkAnmation("South_East");
        } else {
            this.playWalkAnmation("West");
        }
    }
    handlecollision(angle) {



        console.log(this.collisionangle);


        if (this.anlges < (this.collisionangle - 25) || this.anlges > (this.collisionangle + 25)) {
            this.playerSpeed = 0.04
            console.log("abbb");
            console.log(this.count);
            this.count = 0;
            this.collided = false
        }




    }
    enablemovement(angle, lower_number, upper_number, middle_number) {
    }
    playWalkAnmation(walkDirection: String) {
        switch (walkDirection) {
            case "North":
                {
                    this.node.getComponent(Animation)?.play("north");
                }
                break;
            case "East":
                {
                    this.node.getComponent(Animation)?.play("east");
                }
                break;
            case "South":
                {
                    this.node.getComponent(Animation)?.play("south");
                }
                break;
            case "West":
                {
                    this.node.getComponent(Animation)?.play("west");
                }
                break;
            case "North_East":
                {
                    this.node.getComponent(Animation)?.play("northEast");
                }
                break;
            case "North_West":
                {
                    this.node.getComponent(Animation)?.play("northWest");
                }
                break;
            case "South_East":
                {
                    //console.log(walkDirection);
                    this.node.getComponent(Animation)?.play("southEast");
                }
                break;
            case "South_West":
                {
                    //console.log(walkDirection);
                    this.node.getComponent(Animation)?.play("southWest");
                }
                break;
        }
    }
    changeSprite() { }
    update(deltaTime: number) {
        if (this.canMovePlayer) {


            this.pos = new Vec2(this.startPos.x - this.intialPos.x, this.startPos.y - this.intialPos.y);
            if (this.collided) { }
            if (!this.collided) {
                this.finalPos.x -= this.pos.x * this.playerSpeed;
                this.finalPos.y -= this.pos.y * this.playerSpeed;
            }
            else {
                this.finalPos = this.node.getPosition();
            }
            this.pos.x = 0;
            this.pos.y = 0;
        }
        let playerPosition = new Vec3();
        let currentPostion: Vec3 = this.node.getPosition();
        if (this.collided && this.count == 0) {
            console.log(this.playerSpeed);
            if ((this.anlges < 295 && this.anlges > 245) || (this.anlges < 25 || this.anlges > 345) || (this.anlges > 75 && this.anlges < 115) || (this.anlges > 155 && this.anlges < 215)) {
                this.collisionangle = this.anlges;

                this.playerSpeed = 0;
                this.count = 1;
                console.log(1);
            }

        }
        if (this.collided) {
            this.finalPos = currentPostion; this.pos = new Vec2(0, 0); this.collided = false; console.log(this.canMovePlayer, "hell ya");

        }
        Vec3.lerp(playerPosition, currentPostion, this.finalPos, 0.06);
        this.node.setPosition(playerPosition);
        this.camera.setPosition(playerPosition);

    }
}
