import { _decorator, Component, Node, director, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('help')
export class help extends Component {
    // @property({type: Node})
    // rotate: Node = null;

    onLoad(){
        let persistNode = director.getScene().getChildByName("Background")
        // console.log("scene and children", persistNode);
    }

    changeScene(){
        director.loadScene("Login")
    }

    // changeSceneToAvatar(){
    //     director.loadScene("Avatar")
    // }

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

