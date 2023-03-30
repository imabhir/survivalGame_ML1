import { _decorator, Component, Node, TiledMap, PhysicsSystem2D, Contact2DType, Collider2D, IPhysics2DContact, Rect, UITransform, TiledObjectGroup, Vec3, TiledLayer, TiledTile, RigidBody, RigidBody2D, RigidBodyComponent, BoxCollider2D, Vec2, ERigidBody2DType, PhysicsSystem, EPhysics2DDrawFlags, director, Prefab, instantiate, GraphicsComponent, rect, log, Input, TiledMapAsset, Button, Sprite, Event, EventHandler, math, randomRangeInt } from 'cc';
const { ccclass, property } = _decorator;
var player: walls;
var photon;
@ccclass('walls')
export class walls extends Component {
    @property({ type: Node })
    player: Node = null
    @property({ type: Prefab })
    player_prefab: Prefab = null
    @property({ type: Prefab })
    bounding_box: Node = null
    @property({ type: Prefab })
    minigames: Node[][] = []
    @property({ type: Node })
    camera: Node = null
    @property({ type: Node })
    maincamera: Node = null
    @property({ type: Node })
    use_button: Node = null
    player_bb: Rect
    count = 0;
    map: any
    counter: number = 0;
    minigame: Node;
    demo: Photon.LoadBalancing.LoadBalancingClient;
    actors = 0;

    onLoad() {
        PhysicsSystem2D.instance.enable = true;
        this.map = this.node.getComponent(TiledMap)
        console.log(this.node.getComponent(TiledMap).getObjectGroups())
        this.camera.setPosition(this.maincamera.getPosition())

        this.use_button.getComponent(Button).interactable = false
    }
    start() {//refer to link https://juejin.cn/post/7068114266716373029
        this.enablecollision("level1")
        console.log("logged");
        this.setUpConnection();
    }
    setUpConnection() {
    }
    enablecollision(name) {
        let layer: TiledLayer = this.map.getLayer(name)


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
                    collider.density = 1000;
                    collider.restitution = 0;
                    collider.offset = new Vec2(tilesize.width / 2, tilesize.height / 2)
                    collider.apply();
                }
            }
        }
    }
    open() {
        console.log(this.node.parent.getChildByName(this.minigame.name));

        if (this.node.parent.getChildByName(this.minigame.name) == null) {
            console.log(this.minigame.name);
            this.node.parent.addChild(this.minigame)
        }
        console.log("b");
        this.use_button.getComponent(Button).interactable = false




        this.counter = 0;

    }
    update(deltaTime: number) {
        //functionality to check if the bounding box of player collides with an particular bounding box given in tilemap object groups
        let position = this.node.getComponent(UITransform).convertToNodeSpaceAR(this.player.getPosition());
        this.player_bb = new Rect(position.x + this.node.getComponent(UITransform).width * 0.5 - this.player.getComponent(UITransform).width * 0.5, position.y + this.node.getComponent(UITransform).height * 0.5 - this.player.getComponent(UITransform).height * 0.5, this.player.getComponent(UITransform).width, this.player.getComponent(UITransform).height)
        this.node.getComponent(TiledMap).getObjectGroup("interactables").getObjects().forEach((e) => {
            let a: Rect = new Rect(e.x, e.y - e.height, 32, 32)
            let bb = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(a.x, a.y, 0));
            a = new Rect(bb.x, bb.y, e.width, e.height)
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
                this.counter = 1
            }
            else if (this.counter == 1) {

                if (this.minigame.name == this.minigames[e.prefab_name].name) {

                    this.use_button.getComponent(Button).interactable = false
                }
            }
            // if (this.actors != this.data.countofactors && this.data.countofactors > 1) {
            //     if (this.actors < this.data.countofactors) {
            //         let n = this.data.countofactors - this.node.getChildByName("player").children.length;
            //         for (let i = 0; i < n; i++) {
            //             let b = instantiate(this.player_prefab)
            //             b.setPosition(b.getPosition().x - randomRangeInt(50, 200), b.getPosition().y - randomRangeInt(50, 300))
            //             this.node.getChildByName("player").addChild(b);
            //             console.log(b);

            //             this.actors++;
            //         }
            //     }
            // }
        })
    }
}
