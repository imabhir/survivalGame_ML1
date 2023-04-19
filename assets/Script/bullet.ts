import { _decorator, Component, isValid, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('bullet')
export class bullet extends Component {
    start() {

    }
    timeToLive = 5000

    timeAlive = 0

    update(dt) {
        if (!isValid(this.node)) return

        this.timeAlive += dt * 1000
        if (this.timeAlive >= this.timeToLive) this.node.destroy()
    }
}