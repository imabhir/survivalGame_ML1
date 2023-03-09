import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ImageGenerator')
export class ImageGenerator extends Component {
    @property({type: Prefab})
    square: Prefab = null;

    rows = 5;

    onLoad(){
        // this.generatePattern()
    }

    // generatePattern = () => {
    //     for(let i=0;i<this.rows;i++){
    //         for(let j=0;j<=i;j++){

    //         }
    //     }
    // }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

