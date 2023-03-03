import { _decorator, Component, Node, tween, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('login')
export class login extends Component {
    @property({type: Node})
    loader: Node = null;

    @property({type: Node})
    Rotate: Node = null;


    onLoad(){
        director.preloadScene("Avatar")
        console.log("Onload Started");
        tween(this.Rotate).by(2, {angle: -360}).repeatForever().start()

        setTimeout(() => {
            this.changeScene();
        }, 2000);   
    }

    changeScene = () => {
        director.loadScene("Avatar")
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

