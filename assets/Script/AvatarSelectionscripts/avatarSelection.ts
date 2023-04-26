import { _decorator, Component, Node, Prefab, instantiate, PageView, Input, Label, AudioClip, director, tween, Vec3, Slider, sys, NodePool, UITransform, randomRangeInt } from 'cc';
import { audioManager } from '../audio/scripts/audioManager';
// import { audioManager } from '../../audio/scripts/audioManager';
import { resourceManager } from '../singleton/resourceManager';
// import { resourceManager } from '../../singleton/resourceManager';
// import { resourceManager } from '../../resourceManager';
const { ccclass, property } = _decorator;
import { photonmanager } from '../../Script/photon/photonmanager';

@ccclass('avatarSelection')
export class avatarSelection extends Component {
    @property({ type: Prefab })
    avatar: Prefab = null;

    @property({ type: PageView })
    pageView: PageView = null;

    @property({ type: Node })
    startButton: Node = null;

    @property({ type: Node })
    SettingsNode: Node = null;

    @property({ type: Node })
    AccountNode: Node = null;

    @property({ type: Node })
    playerAnimation: Node = null;

    // names = ["Jack","Tim","John","Cook"]
    resourceInstance = resourceManager.getInstance();
    audioInstance = audioManager.getInstance();

    pool1 = new NodePool();
    
    cnt = 0;
    b: any;
    BackgroundHeight;
    BackgroundWidth;
    // Account
    // AccountSettings
    // Settings
    // SettingsControls
    // Music;
    // MusicClip;
    onLoad() {
        // console.log("PersistNode Avatar", director.getScene().getChildByName("PersistNode"));
        // director.getScene().getChildByName("PersistNode").active = false;

        this.BackgroundHeight = this.node.getComponent(UITransform).height
        this.BackgroundWidth = this.node.getComponent(UITransform).width;

       
        // this.resourceInstance.loadPrefabs()
        // .then(() => {
        //     this.Account = this.resourceInstance.GetPrefab("Account")
        //     this.AccountSettings = this.resourceInstance.GetPrefab("AccountSettings")
        //     this.Settings = this.resourceInstance.GetPrefab("Settings")
        //     this.SettingsControls = this.resourceInstance.GetPrefab("SettingsControls")
        //     this.Music = this.resourceInstance.GetPrefab("Music")
        // })
        
        // this.resourceInstance.loadMusic()
        // .then(() => {
        //     this.MusicClip = this.resourceInstance.getMusicFile("AvatarChanging")
        // });


        this.addSettings();
        this.addAccountButton()
        this.addAvatar();

        this.startButton.on(Input.EventType.TOUCH_START, this.goToModes)
        
        this.AddItemsInPool();

        this.schedule(() => {
            this.GetItemFromPool();
        }, 0.6)
        this.b = photonmanager.getInstance().photon_instance;
        this.b.start();

        this.applyMusic()
    }

    AddItemsInPool() {
        for (let i = 0; i <= 5; i++) {
            const avatar = instantiate(this.avatar)
            avatar.getComponent(UITransform).height = 100;
            avatar.getComponent(UITransform).width = 100;
            this.pool1.put(avatar)
            avatar.on(Input.EventType.TOUCH_START, this.randomMovement, this)
        }
    }

    randomMovement(event){
        const randomPosX = randomRangeInt((-1) * this.BackgroundWidth / 2, this.BackgroundWidth / 2)
        const randomPosY = randomRangeInt((-1) * this.BackgroundHeight / 2, this.BackgroundHeight / 2)
        tween(event.target)
        .to(4, { position: new Vec3(randomPosX, randomPosY), angle: 360 })
        .start()
    }

    angle;
    GetItemFromPool() {
        if (this.pool1.size()) {
            const player = this.pool1.get()
            const playerHeight = player.getComponent(UITransform).height
            const randomPosX = randomRangeInt((-1) * this.BackgroundWidth / 2, this.BackgroundWidth / 2)
            const randomPosY = randomRangeInt((-1) * this.BackgroundHeight / 2, this.BackgroundHeight / 2)

            player.setPosition(randomPosX, randomPosY)

            this.cnt++;

            if (this.cnt & 1) {
                this.angle = 360;
            } else {
                this.angle = -360;
            }


            this.animatePlayer(player, this.angle)
            this.playerAnimation.addChild(player)
        }
    }

    animatePlayer(player, angle) {
        tween(player).by(30, { angle: angle }).repeatForever().start();
    }

    checkPlayerPos(pool1, deltaTime) {
        this.playerAnimation.children.forEach((element, index) => {
            const BackgroundHeight = this.node.getComponent(UITransform).height
            const playerHeight = element.getComponent(UITransform).height
            const PlayerPos = element.getPosition();

            if (index & 1) {
                PlayerPos.x += 5 * deltaTime;
            } else {
                PlayerPos.y -= 5 * deltaTime
            }


            element.setPosition(PlayerPos.x, PlayerPos.y)

            if (PlayerPos.y < (-1) * (BackgroundHeight * 0.5)) {
                this.pool1.put(element)
            }
        })
    }


    addAccountButton = () => {
        const account = instantiate(this.resourceInstance.GetPrefab("Account"))
        account.on(Input.EventType.TOUCH_START, this.openAccountInfo)
        this.node.addChild(account)
    }

    openAccountInfo = () => {
        if (this.AccountNode.children.length == 0) {
            const AccountInfo = instantiate(this.resourceInstance.GetPrefab("AccountSettings"))
            this.AccountNode.addChild(AccountInfo)
            AccountInfo.parent.setSiblingIndex(this.node.children.length)
        }
    }

    /**
     * Adding settings icon to avatar selection scene
     */

    addSettings = () => {
        const setting = instantiate(this.resourceInstance.GetPrefab("Settings"))
        setting.on(Input.EventType.TOUCH_START, this.openSettings)
        this.node.addChild(setting) 
    }

    /**
     * Opening of settings
     */

    openSettings = () => {
        if (this.SettingsNode.children.length == 0) {
            let settingsControls = instantiate(this.resourceInstance.GetPrefab("SettingsControls"))
            this.SettingsNode.addChild(settingsControls)
            settingsControls.parent.setSiblingIndex(this.node.children.length)
        }
    }


    /**
     * This functions applies the audio to the scene
     */

    applyMusic = () => {
        console.log("Prefab arrr...................", this.resourceInstance.PrefabArr);
        
        const music = instantiate(this.resourceInstance.GetPrefab("Music"))
        this.node.addChild(music)
        console.log("Music", music);
        
    
        // this.scheduleOnce(() => {
            const clip = this.resourceInstance.getMusicFile("audio1")
            this.audioInstance.playMusicClip(clip, true)
        // }, 0.7)
    }

    /**
     * This function is used for adding avatars
     */
    addAvatar = () => {
        for (let i = 0; i < 4; i++) {
            const avatar = instantiate(this.avatar);
            this.pageView.content.addChild(avatar);
            // avatar.getChildByName("Name").getComponent(Label).string = this.names[i]
        }
    }

    /**
     * This function is used for sliding the avatar forward. Button click event is applied on button.
     */
    changeAvatarForward() {
        let currentIndex = this.pageView.getCurrentPageIndex();
        this.pageView.setCurrentPageIndex(currentIndex + 1)

        const clip = this.resourceInstance.getMusicFile("AvatarChanging")
        this.audioInstance.playSoundEffect(clip)
    }

    /**
     * This function is used for sliding the avatar backward. Button click event is applied on button.
     */
    changeAvatarBackWard() {
        let currentIndex = this.pageView.getCurrentPageIndex();
        this.pageView.setCurrentPageIndex(currentIndex - 1)

        const clip = this.resourceInstance.getMusicFile("AvatarChanging")
        this.audioInstance.playSoundEffect(clip)
    }

    /**
     * Changing the scene
     */
    goToModes = () => {
        director.loadScene("Modes")
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
        this.checkPlayerPos(this.pool1, deltaTime)
    }
}

