import { _decorator, Component, Node, Prefab, instantiate, UITransform, Vec3, Size, randomRangeInt, Sprite, random, JsonAsset, Label, Input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MiniGame2')
export class MiniGame2 extends Component {
    @property({type: Prefab})
    gears: Prefab = null;

    @property({type: JsonAsset})
    properties: JsonAsset = null;

    
    onLoad(){
        this.setGears();
    }

    setGears = () => {
        // for(let i=0;i<this.SizeCount;i++){
        //     const gear = instantiate(this.gears);
        //     const gearHeight = gear.getComponent(UITransform).height + 10;
        //     const pos = gear.getPosition();
        //     gear.setPosition(new Vec3(pos.x, pos.y - gearHeight*i))
        //     const randomNumber = randomRangeInt(50, 90)
        //     gear.getChildByName("Sprite").getComponent(UITransform).height = randomNumber
        //     gear.getChildByName("Sprite").getComponent(UITransform).width = randomNumber
        //     this.node.addChild(gear);
        // }

        this.properties.json.forEach((element, index) => {
            const gear = instantiate(this.gears);
            // gear.on(Input.EventType.)
            const gearHeight = gear.getComponent(UITransform).height + 10;
            const pos = gear.getPosition();
            gear.setPosition(new Vec3(pos.x, pos.y - gearHeight*index))
            gear.getChildByName("Sprite").getComponent(UITransform).height = element.size.height
            gear.getChildByName("Sprite").getComponent(UITransform).width = element.size.width
            gear.getChildByName("Label").getComponent(Label).string = `X ${element.count}`;
            this.node.addChild(gear);
        })
    }


    start() {

    }

    update(deltaTime: number) {
        
    }
}

