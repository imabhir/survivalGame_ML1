import { _decorator, Component, Node, instantiate, Input, Canvas, Prefab, ScrollView, EventHandler, Button, director } from 'cc';
import { audioManager } from '../audio/scripts/audioManager';
import { photonmanager } from '../../Script/photon/photonmanager';
// import { audioManager } from '../../audio/scripts/audioManager';
import { resourceManager } from '../singleton/resourceManager';
import { AvailableRooms } from './AvailableRooms';
const { ccclass, property } = _decorator;

@ccclass('playingOptions')
export class playingOptions extends Component {
    @property({ type: Prefab })
    ScrollRooms: Prefab = null;

    @property({ type: Node })
    JoinRoom: Node = null;

    @property({ type: Node })
    CreateRoom: Node = null;

    @property({ type: Prefab })
    RoomDetails: Prefab = null;

    @property({ type: Node })
    SettingsNode: Node = null;

    @property({ type: Node })
    AccountNode: Node = null;


    resourceInstance = resourceManager.getInstance()
    audioInstance = audioManager.getInstance()
    photon_instance: any;


    onLoad() {
        this.AddAccountButton()
        this.AddSettings()
        this.applyMusic()
        this.resourceInstance.loadPrefabs();
        this.resourceInstance.loadMusic()

        this.photon_instance = photonmanager.getInstance().photon_instance;

        this.JoinRoom.on(Input.EventType.TOUCH_START, () => {
            const ScrollRoom = instantiate(this.ScrollRooms);
            this.node.addChild(ScrollRoom);
            ScrollRoom.getComponent(AvailableRooms).LoadRoom(this.photon_instance.availableRooms())
        })

        this.CreateRoom.on(Input.EventType.TOUCH_START, () => {
            const RoomDetail = instantiate(this.RoomDetails)
            let event = new EventHandler();
            // This node is the node to which your event handler code component belongs
            event.target = RoomDetail;
            // This is the script class name
            event.component = "RoomCreation";
            event.handler = "createroom";


            const button = RoomDetail.getChildByName("Button").getComponent(Button);
            button.clickEvents.push(event);
            this.node.addChild(RoomDetail)
        })
    }

    quickjoin() {

        director.loadScene("playersLobby", this.callback)

    }
    callback() {
        let photon_instance = photonmanager.getInstance().photon_instance;
        if (photon_instance.isInLobby()) {
            photon_instance.joinRandomOrCreateRoom({ expectedMaxPlayers: 5, expectedisOpen: true },
                undefined,
                { emptyRoomLiveTime: 20000, maxPlayers: 5, isOpen: true });




        }
    }

    applyMusic = () => {
        this.scheduleOnce(() => {
            const music = instantiate(this.resourceInstance.getMusicPrefab("Music"))
            this.node.addChild(music)
        }, 1)


        this.scheduleOnce(() => {
            const clip = this.resourceInstance.getMusicFile("audio1")
            this.audioInstance.playMusicClip(clip, true)
        }, 1)
    }


    AddSettings = () => {
        this.scheduleOnce(() => {
            const SettingButton = instantiate(this.resourceInstance.getSettingsPrefab("Settings"))
            SettingButton.on(Input.EventType.TOUCH_START, this.OpenSettingsControls)
            this.node.addChild(SettingButton)
        }, 1)

    }

    OpenSettingsControls = () => {
        if (this.SettingsNode.children.length == 0) {
            const SettingsControls = instantiate(this.resourceInstance.getAccountControlsPrefab("SettingsControls"))
            this.SettingsNode.addChild(SettingsControls);
            SettingsControls.parent.setSiblingIndex(this.node.children.length)
        }
    }






    AddAccountButton = () => {
        this.scheduleOnce(() => {
            const AccountButton = instantiate(this.resourceInstance.getAccountPrefab("Account"))
            AccountButton.on(Input.EventType.TOUCH_START, this.OpenAccountControls)
            this.node.addChild(AccountButton)
        }, 0.7)
    }
    OpenAccountControls = () => {
        this.scheduleOnce(() => {
            const AccountSettings = instantiate(this.resourceInstance.getAccountControlsPrefab("AccountSettings"))
            this.node.addChild(AccountSettings);
        }, 1)

    }



    start() {

    }

    update(deltaTime: number) {

    }
}

