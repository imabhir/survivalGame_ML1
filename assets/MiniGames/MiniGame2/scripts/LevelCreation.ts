import { _decorator, Component, Node, UITransform, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelCreation')
export class LevelCreation extends Component {
    Mainarray1 = []
    Mainarray2 = []

    @property({type: Node})
    NormalGears: Node = null;

    @property({type: Node})
    transparentGears: Node = null;

    onLoad(){
        // this.getGearSize();
        console.log("Onload");
        
        this.gearsPositioning();
    }

    getGearSize = () => {
        this.node.children.forEach((element, index) => {
            if(index!=0){
                let size = {"height": element.getChildByName("Sprite").getComponent(UITransform).height,
                "width": element.getChildByName("Sprite").getComponent(UITransform).width}
                
                let count = element.getChildByName("Label").getComponent(Label).string

                let obj = {"size": size, "count": count}
                this.Mainarray1.push(obj)
            }
        })

        // console.log(this.Mainarray1);
    }

    gearsPositioning = () => {
        let gears = this.NormalGears.children
        let transparentGears = this.transparentGears.children
        let mainObj = {"Gears": [], "TransparentGears": []}
        gears.forEach((element) => {
            let elementPosition = element.getPosition();
            mainObj["Gears"].push({"x": elementPosition.x, "y": elementPosition.y, "size": {"height": element.getComponent(UITransform).height, "width": element.getComponent(UITransform).width}})
        })
        transparentGears.forEach((element) => {
            let elementPosition = element.getPosition();
            mainObj["TransparentGears"].push({"x": elementPosition.x, "y": elementPosition.y, "size": {"height": element.getComponent(UITransform).height, "width": element.getComponent(UITransform).width}})
        })
        this.Mainarray2.push(mainObj)
        console.log(this.Mainarray2);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

