import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('persistNode')
export class persistNode extends Component {
    onLoad(){
        console.log("PersistNode added");   
        
        director.addPersistRootNode(this.node)
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

