import { _decorator, Component, Node, UITransform, Vec3, Vec2, Animation, ImageAsset } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerMovement")
export class PlayerMovement extends Component {
    @property({ type: ImageAsset })
    playerImage: ImageAsset = null;
    @property({ type: Node })
    joystick: Node = null;
    @property({ type: Node })
    joyStickBall: Node = null;
    pos: Vec2 = null;
    startPos: Vec3 = null;
    stopPlayer: boolean = true;
    intialPos: Vec3 = null;
    finalPosBall: Vec3 = null;
    finalPos: Vec3 = null;
    start() {
        this.touchEventsFunc();
    }
    onLoad() {
        this.finalPosBall = new Vec3(1, 1, 0);
        this.finalPos = this.node.getPosition();
        this.intialPos = new Vec3(1, 1, 0);
        this.startPos = this.joyStickBall.getPosition();
    }
    touchEventsFunc() {
        this.joyStickBall.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.joyStickBall.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.joyStickBall.on(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.joyStickBall.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }
    touchEnd() {
        this.stopPlayer = false;
        //console.log("end");
        this.joyStickBall.setPosition(0, 0, 0);
    }
    touchStart() {
        this.joyStickBall.setPosition(0, 0, 0);
        //console.log("start");
    }
    touchMove(e) {
        this.stopPlayer = true;
        this.intialPos = this.joyStickBall.parent
            .getComponent(UITransform)
            .convertToNodeSpaceAR(new Vec3(e.getUILocation().x, e.getUILocation().y, e.getUILocation().z));
        // var finalPosBall: Vec3;
        var len = this.intialPos.length();
        //console.log("len", len);
        var joyStickBallBaseWidth = this.joyStickBall.parent.getComponent(UITransform).getBoundingBox().width / 2;
        if (len > joyStickBallBaseWidth) {
            this.intialPos.x = (this.intialPos.x * joyStickBallBaseWidth) / len;
            this.intialPos.y = (this.intialPos.y * joyStickBallBaseWidth) / len;
        }

        var dy = this.intialPos.y;
        var dx = this.intialPos.x;
        var angleRad = Math.atan2(dy, dx);
        var angleDeg = (angleRad * 180) / Math.PI;
        //console.log("angle ", angleDeg, angleRad);
        this.getDirection(angleDeg);
        this.joyStickBall.setPosition(this.intialPos);
    }
    getDirection(angle) {
        if (angle > -15 && angle < 15) {
            this.playWalkAnmation("East");
        } else if (angle > 15 && angle < 75) {
            this.playWalkAnmation("North_East");
        } else if (angle > 75 && angle < 105) {
            this.playWalkAnmation("North");
        } else if (angle > 105 && angle < 165) {
            this.playWalkAnmation("North_West");
        } else if (angle > 165 && angle < 195) {
            this.playWalkAnmation("West");
        } else if (angle > 195 && angle < 255) {
            this.playWalkAnmation("South_West");
        } else if (angle > 255 && angle > 285) {
            this.playWalkAnmation("South");
        } else {
            this.playWalkAnmation("South_East");
        }
    }
    playWalkAnmation(walkDirection: String) {
        switch (walkDirection) {
            case "North":
                {
                    //console.log(walkDirection);
                    this.node.getComponent(Animation)?.play("north");
                }
                break;
            case "East":
                {
                    //console.log(walkDirection);
                    this.node.getComponent(Animation)?.play("east");
                }
                break;
            case "South":
                {
                    //console.log(walkDirection);
                    this.node.getComponent(Animation)?.play("south");
                }
                break;
            case "West":
                {
                    //console.log(walkDirection);
                    this.node.getComponent(Animation)?.play("west");
                }
                break;
            case "North_East":
                {
                    //console.log(walkDirection);
                    this.node.getComponent(Animation)?.play("northEast");
                }
                break;
            case "North_West":
                {
                    //console.log(walkDirection);
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
        if (this.stopPlayer) {
            this.pos = new Vec2(this.startPos.x - this.intialPos.x, this.startPos.y - this.intialPos.y);
            this.finalPos.x -= this.pos.x * 0.01;
            this.finalPos.y -= this.pos.y * 0.01;
            this.pos.x = 0;
            this.pos.y = 0;
        }

        let playerPosition = new Vec3();
        let currentPostion: Vec3 = this.node.getPosition();
        Vec3.lerp(playerPosition, currentPostion, this.finalPos, 0.06);
        this.node.setPosition(playerPosition);
    }
}
