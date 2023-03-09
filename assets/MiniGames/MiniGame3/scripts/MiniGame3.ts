import { _decorator, Component, Node, Graphics, Color, Input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MiniGame3')
export class MiniGame3 extends Component {
    onLoad(){
        // const g = this.node.getComponent(Graphics)
        // g.fillColor = Color.GREEN
        // g.circle(50, 20, 100)
        // g.stroke();
        // g.fill()
        // // this.node.on(Input.EventType.TOUCH_START, this.fillReqColor)
    }

    // fillReqColor = (event) => {
    //     const newNodeG = this.node.parent.getChildByName("Node").getComponent(Graphics)
    //     const reqColor = event.target.fillColor
    //     newNodeG.circle(512,2,200)
    //     newNodeG.fillColor = reqColor
    //     newNodeG.stroke()
    //     newNodeG.fill()
    //     console.log(reqColor);
    // }


    start() {

    }

    update(deltaTime: number) {
        
    }
}

