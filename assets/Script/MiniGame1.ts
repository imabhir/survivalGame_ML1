import { _decorator, Component, Node, Input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MiniGame1')
export class MiniGame1 extends Component {
    onLoad(){
        let array = this.node.children;
        for(let i=0;i<array.length;i++){
            if(i!=0 && i!=array.length-1){
                array[i].on(Input.EventType.TOUCH_START, this.rotate)
            }
        }
    }

    rotate = (event) => {
        console.log(event.target);
    }
    

    start() {

    }

    update(deltaTime: number) {
        
    }
}

