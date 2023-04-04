import { _decorator, Component, Node, director, tween } from 'cc';
import { help } from './help';
const { ccclass, property } = _decorator;

@ccclass('persistNode')
export class persistNode extends Component {
    @property({type: Node})
    rotate: Node = null;

    onLoad(){
        director.addPersistRootNode(this.node);
    }

    // load = () => {
    //     tween(this.rotate).by(2, {angle: -360}).repeatForever().start()
    //     setTimeout(() => {
    //         director.loadScene("Login");
    //     }, 2000); 
    // }


    start() {
        
    }

    update(deltaTime: number) {
        
    }
}

