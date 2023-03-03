import { _decorator, Component, Node } from 'cc';
import { levelItem } from './levelItem';
const { ccclass, property } = _decorator;
// import fs = require('fs');

@ccclass('LevelCreation')
export class LevelCreation extends Component {
    Mainarray = []
    onLoad(){
        let array = this.node.children;
        array.forEach((element) => {
            let pos = element.getPosition();
            let obj = {"x": pos.x, "y": pos.y, "z": pos.z};
            let itemType = element.getComponent(levelItem).itemType
            let isfixed = element.getComponent(levelItem).isFixed
            let itemObj = {obj, "isFixed": isfixed, "itemType": itemType, "angle": element.angle}
            this.Mainarray.push(itemObj)
        })
        console.log(this.Mainarray);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

