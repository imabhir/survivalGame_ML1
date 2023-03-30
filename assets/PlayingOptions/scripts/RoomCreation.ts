import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RoomCreation')
export class RoomCreation extends Component {
    onLoad(){

    }

    CloseCreateRoom(){
        setTimeout(() => {
            this.node.destroy()
        });
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

