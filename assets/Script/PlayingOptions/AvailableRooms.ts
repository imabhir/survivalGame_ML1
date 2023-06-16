import { _decorator, Component, Node, instantiate, Label, ScrollView, Input, director, Sprite, color, Color } from 'cc';
import { photonmanager } from '../../Script/photon/photonmanager';
const { ccclass, property } = _decorator;

@ccclass('AvailableRooms')
export class AvailableRooms extends Component {
    @property({ type: Node })
    AvailableRoomInfo: Node = null;


    arrOfObj = [
        {
            "RoomId": "1",
            "RoomName": "abc",
            "Number": "5/8",
            "GameMode": "Rush Royale"
        },

        {
            "RoomId": "1",
            "RoomName": "abc",
            "Number": "5/8",
            "GameMode": "Rush Royale"
        },

        {
            "RoomId": "1",
            "RoomName": "abc",
            "Number": "5/8",
            "GameMode": "Rush Royale"
        },

        {
            "RoomId": "1",
            "RoomName": "abc",
            "Number": "5/8",
            "GameMode": "Rush Royale"
        },

        {
            "RoomId": "1",
            "RoomName": "abc",
            "Number": "5/8",
            "GameMode": "Rush Royale"
        }
    ]
    photon_instance: any;

    onLoad() {




        this.photon_instance = photonmanager.getInstance().photon_instance;
    }
    LoadRoom(arrOfObj) {
        arrOfObj.forEach((element) => {
            let NewNode = instantiate(this.AvailableRoomInfo)
            NewNode.getChildByName("RoomName").getComponent(Label).color = Color.WHITE
            NewNode.getChildByName("RoomName").getComponent(Label).string = element.name
            NewNode.getChildByName("Number").getComponent(Label).string = "5"
            NewNode.getChildByName("Number").getComponent(Label).color = Color.WHITE
            NewNode.getChildByName("GameMode").getComponent(Label).string = "standard"
            NewNode.getChildByName("GameMode").getComponent(Label).color = Color.WHITE


            NewNode.on(Input.EventType.TOUCH_START, (en) => {
                this.photon_instance.roomname = element.name.toString();
                director.loadScene("playersLobby", () => {
                    let photon_instance = photonmanager.getInstance().photon_instance;
                    if (photon_instance.isInLobby()) {
                        photon_instance.joinRoom(photon_instance.roomname);
                    }
                })
            })
            this.node.getComponent(ScrollView).content.addChild(NewNode)
        })
    }
    CloseAvailableRoom() {
        setTimeout(() => {
            this.node.destroy()
        });

    }
    start() {

    }

    update(deltaTime: number) {

    }
}

