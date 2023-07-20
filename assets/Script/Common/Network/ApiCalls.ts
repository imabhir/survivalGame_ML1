import {
    _decorator,
    assetManager,
    Component,
    error,
    ImageAsset,
    log,
    native,
    Node,
    SpriteFrame,
    sys,
    Texture2D,
} from "cc";
import { NetworkManager } from "./NetworkManager";
const { ccclass, property } = _decorator;

@ccclass("ApiCalls")
export class ApiCalls extends Component {
    childId: [] = [];
    public static _instance: ApiCalls;
    public static getInstance() {
        if (!ApiCalls._instance) {
            ApiCalls._instance = new ApiCalls();
        }
        return ApiCalls._instance;
    }

    update(deltaTime: number) {}
}
