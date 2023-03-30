import { _decorator, Component, Node, EditBox, log, director } from 'cc';
import { photonmanager } from '../../Script/photon/photonmanager';
const { ccclass, property } = _decorator;

@ccclass('RoomCreation')
export class RoomCreation extends Component {
    @property({ type: EditBox })
    RoomName: EditBox = null;
    photon_instance;
    onLoad() {
        this.photon_instance = photonmanager.getInstance().photon_instance;


    }

    CloseCreateRoom() {
        setTimeout(() => {
            this.node.destroy()
        });
    }
    createroom() {
        console.log(this.RoomName.getComponent(EditBox).string);
        this.photon_instance.roomname = this.RoomName.getComponent(EditBox).string;
        director.loadScene("playersLobby", this.callback)
    }
    callback() {
        let photon_instance = photonmanager.getInstance().photon_instance;
        if (photon_instance.isInLobby()) {
            console.log(photon_instance.roomname);

            photon_instance.createRoom(photon_instance.roomname)
        }
    }
    start() {

    }

    update(deltaTime: number) {

    }
}

