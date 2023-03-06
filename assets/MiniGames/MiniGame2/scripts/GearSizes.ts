import { _decorator, Component, Node, Prefab, instantiate, UITransform, Vec3, Size, randomRangeInt, Sprite, random, JsonAsset, Label, Input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MiniGame2')
export class MiniGame2 extends Component {
    @property({type: Prefab})
    gears: Prefab = null;

    @property({type: JsonAsset})
    GearSize: JsonAsset = null;

    @property({type: Prefab})
    gearImage: Prefab = null;

    @property({type: JsonAsset})
    levels: JsonAsset = null;

    @property({type: Node})
    transparentGears: Node = null;

    startPos:Vec3
    onLoad(){
        this.setGearSizes();
    }

    setGearSizes = () => {
        this.GearSize.json.forEach((element, index) => {
            const gear = instantiate(this.gears);
            // gear.on(Input.EventType.)
            // Touch Event
            gear.on(Input.EventType.TOUCH_START, this.createImage)
            gear.on(Input.EventType.TOUCH_MOVE, this.drag)
            gear.on(Input.EventType.TOUCH_CANCEL, this.checkPosition)
            const gearHeight = gear.getComponent(UITransform).height + 10;
            const pos = gear.getPosition();
            gear.setPosition(new Vec3(pos.x, pos.y - gearHeight*index))
            gear.getChildByName("Sprite").getComponent(UITransform).height = element.size.height
            gear.getChildByName("Sprite").getComponent(UITransform).width = element.size.width
            gear.getChildByName("Label").getComponent(Label).string = `${element.count}`;
            this.node.addChild(gear);
        })
    }

    newGear;
    createImage = (event) => {
        this.startPos = event.target.getPosition()
        this.newGear = instantiate(this.gearImage)
        this.newGear.getComponent(UITransform).height = event.target.getChildByName("Sprite").getComponent(UITransform).height
        this.newGear.getComponent(UITransform).width = event.target.getChildByName("Sprite").getComponent(UITransform).width
        this.node.addChild(this.newGear)
        this.newGear.setWorldPosition(event.getUILocation().x,event.getUILocation().y,0);
    }


    drag = (event) => {
        this.newGear.setWorldPosition(event.getUILocation().x, event.getUILocation().y,0)
    }


    checkPosition = (event) => {
        this.transparentGears.children.forEach((element) => {
            const elementPosition = element.getWorldPosition();
            const targetPosition = event.getUILocation();
            
            
            const targetHeight = event.target.getChildByName("Sprite").getComponent(UITransform).height
            const targetWidth = event.target.getChildByName("Sprite").getComponent(UITransform).width
            if(elementPosition.x == targetPosition.x && elementPosition.y == targetPosition.y){
                if(targetHeight == element.getComponent(UITransform).height && targetWidth == element.getComponent(UITransform).width){
                    console.log("Completed");
                }
            }else{
                event.target.setPosition(this.startPos)
            }
        })
    }



    start() {

    }

    update(deltaTime: number) {
        
    }
}

