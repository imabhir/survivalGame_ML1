import { _decorator, Component, Node, tween, director, ProgressBar } from 'cc';
import { resourceManager } from '../../singleton/resourceManager';
const { ccclass, property } = _decorator;

@ccclass('load')
export class login extends Component {
    @property({type: Node})
    loader: Node = null;

    @property({type: Node})
    Rotate: Node = null;

    resourceInstance = resourceManager.getInstance()
    onLoad(){
        /**
         * Function which handles loading
         */

        /**
         * This settimeout function accepts a callback which changes scene after 2 seconds
         */

        // this.load()

        // let persistNode = director.getScene().getChildByName("Background")
        // console.log(persistNode);
        // let persistNode = this.node.getChildByName("Background")
    }

    // /**
    //  * Function for loading icon
    //  */

    // load = () => {
    //     tween(this.Rotate).by(2, {angle: -360}).repeatForever().start()
    //     setTimeout(() => {
    //         director.loadScene("Login");
    //     }, 2000); 
    // }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

