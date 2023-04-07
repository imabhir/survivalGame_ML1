import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('persistNode')
export class persistNode extends Component {
    protected onLoad(): void {
        director.addPersistRootNode(this.node)
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

