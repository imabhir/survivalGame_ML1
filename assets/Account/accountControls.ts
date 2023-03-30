import { _decorator, Component, Node, Canvas, Input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('accountControls')
export class accountControls extends Component {
    @property({type: Node})
    closeButton: Node = null;

    onLoad(){
        console.log("Onload Started");

        this.closeButton.on(Input.EventType.TOUCH_START, () => {
            setTimeout(() => {
                this.node.destroy()
            });
        })
    }


    start() {
        console.log("Started");
    }

    update(deltaTime: number) {
        
    }
}

