import { _decorator, Component, Node } from 'cc';
// import photon from './photon';
const { ccclass, property } = _decorator;


@ccclass('PhotonChatManager')
export class PhotonChatManager {
    public static instance: PhotonChatManager;
    public photon: any;
    public roomname;
    public gamestarted;
    private constructor() { }
    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PhotonChatManager()
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

