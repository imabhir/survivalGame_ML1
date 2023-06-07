import { _decorator, Camera, Component, Input, log, Node, Tween, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DISPLAYMAPS')
export class DISPLAYMAPS extends Component {
    @property({ type: Camera })
    camera: Camera = null
    @property({ type: Node })
    center: Node = null
    positions
    positionofcamera
    protected start(): void {
        this.positions = this.node.getPosition();
        this.positionofcamera = this.camera.node.parent.getPosition()
    }
    map() {
        let tween = new Tween(this.node)
        this.node.parent.getChildByName("background").active = false
        tween.to(0, { position: new Vec3(0, 0, 0) }).call(() => {
            this.node.setScale(new Vec3(2.5, 2.5, 2.5))
            this.node.children[0].active = true
        }).start()
        this.camera.orthoHeight = 2500
        console.log("a");
        let position = this.camera.node.parent.getComponent(UITransform).convertToNodeSpaceAR(this.center.getPosition())
        this.camera.node.setPosition(position.x + 1000, position.y + 700, 0)
    }

    map1() {
        let tween = new Tween(this.node)
        tween.to(0, { position: this.positions }).call(() => {
            this.node.setScale(new Vec3(1, 1, 1))
            this.node.parent.getChildByName("background").active = true
            this.node.children[0].active = false
        }).start()
        this.camera.orthoHeight = 750
        this.camera.node.setPosition(0, 0, 0)
    }
    protected update(dt: number): void {
    }
}

