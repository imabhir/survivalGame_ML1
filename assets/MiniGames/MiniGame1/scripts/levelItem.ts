import { _decorator, Component, Node, Enum } from 'cc';
const { ccclass, property } = _decorator;

// Enum for stick type
export enum ITEM_TYPE{
    NONE = 0,
    STRAIGHT = 1,
    L_SHAPED = 2,
    BEGIN = 3,
    END = 4
}

export interface itemDataType{
    "obj": {
        "x": number,
        "y": number,
        "z": number
    },
    "isFixed": boolean,
    "itemType": ITEM_TYPE,
    "angle": number
}

@ccclass('levelItem')
export class levelItem extends Component {
    @property({type: Enum(ITEM_TYPE)})
    itemType: ITEM_TYPE = ITEM_TYPE.NONE

    @property({type: Boolean})
    isFixed: Boolean = false

    resultantAngle:number;

    start() {

    }

    update(deltaTime: number) {
        
    }
}

