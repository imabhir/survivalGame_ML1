import { _decorator, Component, Node, TiledMap, PhysicsSystem2D, Contact2DType, Collider2D, IPhysics2DContact, Rect, UITransform, TiledObjectGroup, Vec3, TiledLayer, TiledTile, RigidBody, RigidBody2D, RigidBodyComponent, BoxCollider2D, Vec2, ERigidBody2DType, PhysicsSystem, EPhysics2DDrawFlags, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('walls')
export class walls extends Component {
    @property({ type: Node })
    player: Node = null
    player_bb: Rect
    map: any
    onLoad() {
        PhysicsSystem2D.instance.enable = true;
        this.map = this.node.getComponent(TiledMap)
        console.log(this.node.getComponent(TiledMap).getObjectGroups())
    }
    start() {
        let layer: TiledLayer = this.map.getLayer("Tile Layer 2")
        layer.getComponent(UITransform).setAnchorPoint(0, 0);
        let tilesize = layer.getMapTileSize();
        for (let i = 0; i < layer.getLayerSize().width; i++) {
            for (let j = 0; j < layer.getLayerSize().height; j++) {
                let tile: TiledTile = layer.getTiledTileAt(i, j, true);
                if (tile.grid != 0) {
                    tile.addComponent(RigidBody2D);
                    tile.getComponent(RigidBody2D).type = ERigidBody2DType.Static;
                    tile.getComponent(RigidBody2D).allowSleep = false;
                    tile.getComponent(RigidBody2D).awakeOnLoad = true;
                    tile.getComponent(RigidBody2D).gravityScale = 0;
                    let collider = tile.addComponent(BoxCollider2D);
                    collider.size = tilesize;
                    collider.offset = new Vec2(tilesize.width / 2, tilesize.height / 2)
                    collider.apply();
                }
            }
        }

    }

    update(deltaTime: number) {


        // this.player_bb = this.player.getComponent(UITransform).getBoundingBoxToWorld();
        // let b: Rect = new Rect(this.player_bb.x, 0, 32, 32);
        // let aa: any = this.node.getComponent(TiledMap).getObjectGroups()[1].getObjects()[0];
        // let a: Rect = new Rect(aa.x, 0, 617, 452);
        // // let a: Rect = new Rect(this.node.getComponent(TiledMap).getObjectGroups()[0].getObjects()[0].x, this.node.getComponent(TiledMap).getObjectGroups()[0].getObjects()[0].y, 32, 32)
        // if (this.player_bb.intersects(a)) {
        //     console.log("lad gaya");
        // }

        // if (this.player_bb.intersects(a)) {
        //     console.log("lad gaya");
        // }

    }
}

