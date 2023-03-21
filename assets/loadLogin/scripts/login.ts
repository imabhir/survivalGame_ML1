import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('login')
export class load extends Component {
    onLoad(){

    }

    changeScene(){
        director.loadScene("Avatar")
    }


    start() {

    }

    update(deltaTime: number) {
        
    }
}