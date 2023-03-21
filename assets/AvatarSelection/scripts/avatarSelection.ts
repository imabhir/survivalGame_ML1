import { _decorator, Component, Node, Prefab, instantiate, PageView, Input, Label, AudioClip, director, tween, Vec3, Slider, sys } from 'cc';
import { audioManager } from '../../audio/scripts/audioManager';
import { resourceManager } from '../../singleton/resourceManager';
// import { resourceManager } from '../../singleton/resourceManager';
// import { resourceManager } from '../../resourceManager';
const { ccclass, property } = _decorator;

@ccclass('avatarSelection')
export class avatarSelection extends Component {
    @property({type: Prefab})
    avatar: Prefab = null;

    @property({type:PageView})
    pageView: PageView = null;

    @property({type: Node})
    startButton: Node = null;

    
    // names = ["Jack","Tim","John","Cook"]

    resourceInstance = resourceManager.getInstance();
    audioInstance = audioManager.getInstance();
    onLoad(){
        this.addAvatar();
        this.applyMusic();
        this.addSettings();
        this.resourceInstance.loadAvatarSprites()
       
        this.resourceInstance.loadPrefabs();
        this.resourceInstance.loadMusic();
        // this.CharacterSelected.active = false;
        this.startButton.on(Input.EventType.TOUCH_START, this.goToModes)
        // this.SelectAvatarButton.on(Input.EventType.TOUCH_START, this.selectAvatar)
    }

    /**
     * Adding settings icon to avatar selection scene
     */

    addSettings = () => {
        this.scheduleOnce(() => {
            const setting = instantiate(this.resourceInstance.getSettingsPrefab("Settings"))
            setting.on(Input.EventType.TOUCH_START, this.openSettings)
            this.node.addChild(setting)
        }, 1)
    }

    /**
     * Opening of settings
     */

    openSettings = () => {
        const settingsControls = instantiate(this.resourceInstance.getSettingsControlsPrefab("SettingsControls"))
        this.node.addChild(settingsControls)
    }
    

    /**
     * This functions applies the audio to the scene
     */

    applyMusic = () => {
        this.scheduleOnce(() => {
            const music = instantiate(this.resourceInstance.getMusicPrefab("Music"))
            this.node.addChild(music)
        }, 1)
        
        
        this.scheduleOnce(()=>{
            const clip = this.resourceInstance.getMusicFile("audio1") 
            this.audioInstance.playMusicClip(clip, true)
        }, 1)
    }

    /**
     * This function is used for adding avatars
     */
    addAvatar = () => {
        for(let i=0;i<4;i++){
            const avatar = instantiate(this.avatar);
            this.pageView.content.addChild(avatar);
            // avatar.getChildByName("Name").getComponent(Label).string = this.names[i]
        }
    }

    /**
     * This function is used for sliding the avatar forward. Button click event is applied on button.
     */
    changeAvatarForward(){
        let currentIndex = this.pageView.getCurrentPageIndex();
        this.pageView.setCurrentPageIndex(currentIndex+1)
        
        const clip = this.resourceInstance.getMusicFile("AvatarChanging") 
        this.audioInstance.playSoundEffect(clip)    
    }

    /**
     * This function is used for sliding the avatar backward. Button click event is applied on button.
     */
    changeAvatarBackWard(){
        let currentIndex = this.pageView.getCurrentPageIndex();
        this.pageView.setCurrentPageIndex(currentIndex-1)
        
        const clip = this.resourceInstance.getMusicFile("AvatarChanging") 
        this.audioInstance.playSoundEffect(clip)
    }

    /**
     * Changing the scene
     */
    goToModes = () => {
        director.loadScene("Modes")
    }


    /**
     * Selection of avatar
     */
    selectAvatar = () => {
        let getAvatar: Node;
        this.pageView.content.children.forEach((element, index) => {
            if(index == this.pageView.getCurrentPageIndex()){
                getAvatar = element
            }
        })

        tween(getAvatar).to(0.3, {scale: new Vec3(1.5, 1.5)}).start()
        this.node.getChildByName("Arrows").active = false;
        // this.CharacterSelected.active = true
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

