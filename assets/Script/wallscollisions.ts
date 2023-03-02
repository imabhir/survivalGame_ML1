import { _decorator, Component, Node, TiledMap, PhysicsSystem2D, Contact2DType, Collider2D, IPhysics2DContact, Rect, UITransform, TiledObjectGroup, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('walls')
export class walls extends Component {
    @property({ type: Node })
    player: Node = null
    player_bb: Rect
    onLoad() {



        console.log(this.node.getComponent(TiledMap).getObjectGroups())



    }
    start() {
    }

    update(deltaTime: number) {


        this.player_bb = this.player.getComponent(UITransform).getBoundingBoxToWorld();
        let b: Rect = new Rect(this.player_bb.x, 0, 32, 32);
        let aa: any = this.node.getComponent(TiledMap).getObjectGroups()[0].getObjects()[0];
        let a: Rect = new Rect(aa.x, 0, 617, 452);
        // let a: Rect = new Rect(this.node.getComponent(TiledMap).getObjectGroups()[0].getObjects()[0].x, this.node.getComponent(TiledMap).getObjectGroups()[0].getObjects()[0].y, 32, 32)
        if (this.player_bb.intersects(a)) {
            console.log("lad gaya");
        }

        // if (this.player_bb.intersects(a)) {
        //     console.log("lad gaya");
        // }

    }
}

