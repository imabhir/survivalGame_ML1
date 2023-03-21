import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayersIndexManager')
export class PlayersIndexManager extends Component {
    start() {

    }

    update(deltaTime: number) {
        let childrens: Node[] = [...this.node.children];
        childrens.sort((a, b) => b.position.y - a.position.y);
        childrens.forEach((child, index) => {
            child.setSiblingIndex(index);
        })
    }
}

