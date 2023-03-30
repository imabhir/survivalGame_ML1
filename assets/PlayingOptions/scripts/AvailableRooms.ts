import { _decorator, Component, Node, instantiate, Label, ScrollView } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AvailableRooms')
export class AvailableRooms extends Component {
    @property({type: Node})
    AvailableRoomInfo: Node = null;

    // @property({type: Node})
    // RoomID: Node = null;

    // @property({type: Node})
    // RoomName: Node = null;

    // @property({type: Node})
    // Number: Node = null;

    // @property({type: Node})
    // GameMode: Node = null;


    arrOfObj = [
        {
            "RoomId": "1",
            "RoomName": "abc",
            "Number": "3/8",
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

    onLoad(){
        this.arrOfObj.forEach((element) => {
            console.log(element);
            
            let NewNode = instantiate(this.AvailableRoomInfo)
            NewNode.getChildByName("RoomID").getComponent(Label).string = element.RoomId
            NewNode.getChildByName("RoomName").getComponent(Label).string = element.RoomName
            NewNode.getChildByName("Number").getComponent(Label).string = element.Number
            NewNode.getChildByName("GameMode").getComponent(Label).string = element.GameMode
            // this.RoomID.getComponent(Label).string = element.RoomId
            // this.RoomName.getComponent(Label).string = element.RoomName
            // this.Number.getComponent(Label).string = element.Number
            // this.GameMode.getComponent(Label).string = element.GameMode

            this.node.getComponent(ScrollView).content.addChild(NewNode)
        })
    }

    CloseAvailableRoom(){
        setTimeout(() => {
            this.node.destroy()
        });
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

