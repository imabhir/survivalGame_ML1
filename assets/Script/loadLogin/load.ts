import { _decorator, Component, Node, tween, director, ProgressBar } from 'cc';
import { resourceManager } from '../singleton/resourceManager';
const { ccclass, property } = _decorator;

@ccclass('load')
export class login extends Component {
    @property({ type: Node })
    loader: Node = null;

    @property({ type: Node })
    Rotate: Node = null;

    resourceInstance = resourceManager.getInstance()
    onLoad() {
        /**
         * Function which handles loading
         */

        this.load()

        /**
         * This settimeout function accepts a callback which changes scene after 2 seconds
         */
        setTimeout(() => {
            this.changeScene();
        }, 2000);
    }

    load = () => {
        tween(this.Rotate).by(2, { angle: -360 }).repeatForever().start()
    }

    changeScene = () => {
        director.loadScene("Login")
    }

    start() {

    }

    update(deltaTime: number) {

    }
}

