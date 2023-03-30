import { _decorator, Component, Node, instantiate, Input, Canvas, Prefab, ScrollView } from 'cc';
import { audioManager } from '../../audio/scripts/audioManager';
// import { audioManager } from '../../audio/scripts/audioManager';
import { resourceManager } from '../../singleton/resourceManager';
const { ccclass, property } = _decorator;

@ccclass('playingOptions')
export class playingOptions extends Component {
    @property({type: Prefab})
    ScrollRooms: Prefab = null;

    @property({type: Node})
    JoinRoom: Node = null;

    @property({type: Node})
    CreateRoom: Node = null;

    @property({type: Prefab})
    RoomDetails: Prefab = null;

    @property({type: Node})
    SettingsNode: Node = null;

    @property({type: Node})
    AccountNode: Node = null;

    
    resourceInstance = resourceManager.getInstance()
    audioInstance = audioManager.getInstance()

    
    onLoad(){
        this.AddAccountButton()
        this.AddSettings()
        
        this.resourceInstance.loadPrefabs();
        this.resourceInstance.loadMusic()
        this.JoinRoom.on(Input.EventType.TOUCH_START, () => {
            const ScrollRoom = instantiate(this.ScrollRooms)
            this.node.addChild(ScrollRoom)
        })

        this.CreateRoom.on(Input.EventType.TOUCH_START, () => {
            const RoomDetail = instantiate(this.RoomDetails)
            this.node.addChild(RoomDetail)
        })
        this.applyMusic()
    }


    applyMusic = () => {
        this.scheduleOnce(() => {
            const music = instantiate(this.resourceInstance.getMusicPrefab("Music"))
            this.node.addChild(music)
        }, 0.7)
        
        
        this.scheduleOnce(()=>{
            const clip = this.resourceInstance.getMusicFile("audio1") 
            this.audioInstance.playMusicClip(clip, true)
        }, 0.7)
    }


    AddSettings = () => {
        this.scheduleOnce(() => {
            const SettingButton = instantiate(this.resourceInstance.getSettingsPrefab("Settings"))
            SettingButton.on(Input.EventType.TOUCH_START, this.OpenSettingsControls)
            this.node.addChild(SettingButton)
        }, 1)
        
    }

    OpenSettingsControls = () => {
        if(this.SettingsNode.children.length == 0){
            const SettingsControls = instantiate(this.resourceInstance.getAccountControlsPrefab("SettingsControls"))
            this.SettingsNode.addChild(SettingsControls);
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
        if(this.AccountNode.children.length == 0){
            const AccountSettings = instantiate(this.resourceInstance.getAccountControlsPrefab("AccountSettings"))
            this.AccountNode.addChild(AccountSettings);
        }
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

