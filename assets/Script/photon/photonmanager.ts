import { _decorator, Component, Node, resources, SpriteFrame, Sprite, Prefab, instantiate, AudioClip, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("photonmanager")
export class photonmanager {
    public static instance: photonmanager;
    public countofactors: any;
    public prefabs: any;
    public audioClip: AudioClip;
    inlobby: boolean
    public photon: any;
    public roomname;
    public gamestarted = false;
    private constructor() { }
    public static getInstance() {
        if (this.instance == null) {
            this.instance = new photonmanager()
        }
        return this.instance;
    }
    set photon_instance(instance: any) {
        this.photon = instance;

    }
    get photon_instance() {
        return this.photon;
    }
}
