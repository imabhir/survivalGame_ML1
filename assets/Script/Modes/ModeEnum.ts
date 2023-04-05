import { _decorator, Component, Node, Enum } from 'cc';
const { ccclass, property } = _decorator;


export enum MODE_NAME{
    NONE = 0,
    PRIMARY = 1,
    SECONDARY = 2,
    TERTIARY = 3
}

@ccclass('ModeEnum')
export class ModeEnum extends Component {
    @property({type: Enum(MODE_NAME)})
    ModeName: MODE_NAME = MODE_NAME.NONE

    start() {

    }

    update(deltaTime: number) {
        
    }
}

