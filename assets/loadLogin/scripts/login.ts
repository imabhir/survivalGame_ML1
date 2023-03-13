import { _decorator, Component, Node, tween, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('login')
export class login extends Component {
    @property({type: Node})
    loader: Node = null;

    @property({type: Node})
    Rotate: Node = null;


    onLoad(){
        // Preloading avatar scene
        director.preloadScene("Avatar")

        /**
         * Function which handles loading
         */
        this.load()
        
        /**
         * This setimeout function accepts a callback which changes scene after 2 seconds
         */
        setTimeout(() => {
            this.changeScene();
        }, 2000);   
    }

    load = () => {
        tween(this.Rotate).by(2, {angle: -360}).repeatForever().start()
    }

    changeScene = () => {
        director.loadScene("Avatar")
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

