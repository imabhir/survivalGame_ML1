import { _decorator, Component, Node, resources, SpriteFrame, Sprite, Prefab, instantiate, AudioClip, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("data_manager")
export class data_manager {
    public static instance: data_manager;
    public countofactors: any;
    public prefabs: any;
    public audioClip: AudioClip;
    inlobby: boolean
    public actorproperties: Vec3;
    private constructor() { }
    public static getInstance() {
        if (this.instance == null) {
            this.instance = new data_manager()
        }
        return this.instance;
    }
    set actorproperty(aa: any) {
        this.actorproperties = aa;

    }
    get actorproperty() {
        return this.actorproperties;
    }
}
