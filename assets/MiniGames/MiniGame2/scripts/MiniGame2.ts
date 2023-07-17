import { _decorator, Component, Node, Prefab, instantiate, UITransform, random, randomRange, JsonAsset } from "cc";
// import { MiniGame2 } from './MiniGame2';
const { ccclass, property } = _decorator;

@ccclass("subBackground")
export class subBackground extends Component {
    @property({ type: Prefab })
    gears: Prefab = null;

    @property({ type: Prefab })
    transparentGears: Prefab = null;

    @property({ type: JsonAsset })
    levels: JsonAsset = null;

    onLoad() {
        this.gameInstantiation();
    }

    gameInstantiation = () => {
        // Setting of left gears which is of different sizes which can be dragged
        this.levels.json.forEach((element) => {
            let Gears = this.node.getChildByName("NormalGears");
            element.Gears.forEach((element) => {
                const gear = instantiate(this.gears);
                const gearSprite = gear.getChildByName("Sprite");
                gearSprite.setPosition(element.x, element.y);
                gearSprite.getComponent(UITransform).height = element.size.height;
                gearSprite.getComponent(UITransform).width = element.size.width;
                Gears.addChild(gearSprite);
            });

            // Setting of game gears on which item is to be placed
            let TransparentGears = this.node.getChildByName("TransparentGears");
            element.TransparentGears.forEach((element) => {
                const transparentGear = instantiate(this.transparentGears);
                transparentGear.setPosition(element.x, element.y);
                transparentGear.getComponent(UITransform).height = element.size.height;
                transparentGear.getComponent(UITransform).width = element.size.width;
                TransparentGears.addChild(transparentGear);
            });
        });
    };

    start() {}

    update(deltaTime: number) {}
}
