import { _decorator, Component, Node, Prefab, instantiate, PageView, Input, Label, AudioClip, director, tween, Vec3, Slider, sys } from 'cc';
import { audioManager } from '../../audio/scripts/audioManager';
// import { audioManager } from '../../audio/scripts/audioManager';
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

    @property({type: Node})
    SettingsNode: Node = null;

    @property({type: Node})
    AccountNode: Node = null;

    
    // names = ["Jack","Tim","John","Cook"]
    resourceInstance = resourceManager.getInstance();
    audioInstance = audioManager.getInstance();
    onLoad(){
        // let node = director.getScene().getChildByName("Background")
        this.resourceInstance.loadPrefabs();
        this.resourceInstance.loadMusic();


        this.addSettings();
        this.addAccountButton()
        this.addAvatar();
        
        
        this.startButton.on(Input.EventType.TOUCH_START, this.goToModes)
        this.applyMusic();
    }



    addAccountButton = () => {
        this.scheduleOnce(() => {
            const account = instantiate(this.resourceInstance.getAccountPrefab("Account"))
            director.addPersistRootNode(account)
            account.on(Input.EventType.TOUCH_START, this.openAccountInfo)
            this.node.addChild(account)
        }, 0.7)
    }

    openAccountInfo = () => {
        if(this.AccountNode.children.length == 0){
            const AccountInfo = instantiate(this.resourceInstance.getAccountControlsPrefab("AccountSettings"))
            this.AccountNode.addChild(AccountInfo)
        }
    }

    /**
     * Adding settings icon to avatar selection scene
     */

    addSettings = () => {
        this.scheduleOnce(() => {
            const setting = instantiate(this.resourceInstance.getSettingsPrefab("Settings"))
            setting.on(Input.EventType.TOUCH_START, this.openSettings)
            this.node.addChild(setting)
        }, 0.7)
    }

    /**
     * Opening of settings
     */
    
    openSettings = () => {
        if(this.SettingsNode.children.length == 0){
            let settingsControls = instantiate(this.resourceInstance.getSettingsControlsPrefab("SettingsControls"))
            this.SettingsNode.addChild(settingsControls)   
        }   
    }
    

    /**
     * This functions applies the audio to the scene
     */

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
        // async fetchResource(){
        //     this.spriteArr = await singletonInstance.resourceLoad();
        //     this.fetchBackground();
        // }
    
        // /**
        //  * This function is setting the background image
        //  */
    
        // fetchBackground(){
        //     let backgroundImage = this.spriteArr[singletonInstance.indexAsset("bg")];
        //     this.background.getComponent(Sprite).spriteFrame = backgroundImage;
            
    
        //     tween(this.loader).by(4, {angle: -360}).repeatForever().start();
            
        //     setTimeout(() => {
        //         this.node.getChildByName("loading icon").active = false;
        //         this.node.getChildByName("loader").active = false;
        //         this.fetchLogo();
        //     }, 2000)
            
        // }
    }

    update(deltaTime: number) {
        
    }
}

