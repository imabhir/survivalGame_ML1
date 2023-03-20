import { _decorator, Component, Node, tween, director, ProgressBar } from 'cc';
import { resourceManager } from '../../singleton/resourceManager';
const { ccclass, property } = _decorator;

@ccclass('login')
export class login extends Component {
    @property({type: Node})
    loader: Node = null;

    @property({type: Node})
    Rotate: Node = null;

    @property({type: ProgressBar})
    progressBar: ProgressBar = null;


    resourceInstance = resourceManager.getInstance()
    onLoad(){
        // Preloading avatar scene
        // director.preloadScene("Avatar")

        /**
         * Function which handles loading
         */
        
        // this.load()
        
        /**
         * This setimeout function accepts a callback which changes scene after 2 seconds
         */
        // setTimeout(() => {
        //     this.changeScene();
        // }, 2000);   
    }

    load = () => {
        // tween(this.Rotate).by(2, {angle: -360}).repeatForever().start()
        
        // Array.size/6*100

    }

    // changeScene = () => {
    //     director.loadScene("Avatar")
    // }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

