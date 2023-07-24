import {
    _decorator,
    Component,
    Node,
    Prefab,
    instantiate,
    PageView,
    Input,
    Label,
    AudioClip,
    director,
    tween,
    Vec3,
    NodePool,
    UITransform,
    randomRangeInt,
    log,
} from "cc";
import { audioManager } from "../audio/scripts/audioManager";
import { resourceManager } from "../singleton/resourceManager";
const { ccclass, property } = _decorator;
import { photonmanager } from "../../Script/photon/photonmanager";
import { DataHandler } from "../singleton/DataHandler";
import { loginscreen } from "../loadLogin/loginscreen";
import { PopupManager } from "../PopUpHandler/PopupManager";
import { POPUPS } from "../constants/Popup";
import PopupBase from "../PopUpHandler/PopupBase";

@ccclass("avatarSelection")
export class avatarSelection extends PopupBase {
    @property({ type: Prefab })
    avatar: Prefab = null;

    @property({ type: PageView })
    pageView: PageView = null;

    @property({ type: Node })
    startButton: Node = null;

    @property({ type: Node })
    playerAnimation: Node = null;

    resourceInstance = resourceManager.getInstance();
    audioInstance = audioManager.getInstance();
    newFlag: string = "";
    pool1 = new NodePool();

    cnt = 0;
    photonInstance: any = null;
    BackgroundHeight;
    BackgroundWidth;
    angle;
    onLoad() {
        this.BackgroundHeight = this.node.getComponent(UITransform).height;
        this.BackgroundWidth = this.node.getComponent(UITransform).width;
        // this.addSettings();
        // this.addAccountButton();
        this.addAvatar();

        this.startButton.on(Input.EventType.TOUCH_START, this.goToModes);

        this.AddItemsInPool();

        this.schedule(() => {
            this.GetItemFromPool();
        }, 0.6);
        this.photonInstance = photonmanager.getInstance().photon_instance;
        this.photonInstance.start();
        console.log("photon start function called ");

        this.applyMusic();
    }

    AddItemsInPool() {
        for (let i = 0; i <= 5; i++) {
            const avatar = instantiate(this.avatar);
            avatar.getComponent(UITransform).height = 100;
            avatar.getComponent(UITransform).width = 100;
            this.pool1.put(avatar);
            avatar.on(Input.EventType.TOUCH_START, this.randomMovement, this);
        }
    }

    randomMovement(event) {
        const randomPosX = randomRangeInt((-1 * this.BackgroundWidth) / 2, this.BackgroundWidth / 2);
        const randomPosY = randomRangeInt((-1 * this.BackgroundHeight) / 2, this.BackgroundHeight / 2);
        tween(event.target)
            .to(4, { position: new Vec3(randomPosX, randomPosY), angle: 360 })
            .start();
    }

    GetItemFromPool() {
        if (this.pool1.size()) {
            const player = this.pool1.get();
            const playerHeight = player.getComponent(UITransform).height;
            const randomPosX = randomRangeInt((-1 * this.BackgroundWidth) / 2, this.BackgroundWidth / 2);
            const randomPosY = randomRangeInt((-1 * this.BackgroundHeight) / 2, this.BackgroundHeight / 2);

            player.setPosition(randomPosX, randomPosY);

            this.cnt++;

            if (this.cnt & 1) {
                this.angle = 360;
            } else {
                this.angle = -360;
            }

            this.animatePlayer(player, this.angle);
            this.playerAnimation.addChild(player);
        }
    }

    animatePlayer(player, angle) {
        tween(player).by(30, { angle: angle }).repeatForever().start();
    }

    checkPlayerPos(pool1, deltaTime) {
        this.playerAnimation.children.forEach((element, index) => {
            const BackgroundHeight = this.node.getComponent(UITransform).height;
            const playerHeight = element.getComponent(UITransform).height;
            const PlayerPos = element.getPosition();

            if (index & 1) {
                PlayerPos.x += 5 * deltaTime;
            } else {
                PlayerPos.y -= 5 * deltaTime;
            }

            element.setPosition(PlayerPos.x, PlayerPos.y);

            if (PlayerPos.y < -1 * (BackgroundHeight * 0.5)) {
                this.pool1.put(element);
            }
        });
    }

    addAccountButton() {
        this.newFlag = "Immediately open";
        PopupManager.show(POPUPS.ACCOUNT, this.newFlag);
    }

    /**
     * Adding settings icon to avatar selection scene
     */

    addSettings() {
        this.newFlag = "Immediately open";
        PopupManager.show(POPUPS.SETTINGS, this.newFlag);
    }

    /**
     * Opening of settings
     */

    /**
     * This functions applies the audio to the scene
     */

    applyMusic = () => {
        console.log("Prefab arrr...................", this.resourceInstance.PrefabArr);

        const music = instantiate(this.resourceInstance.GetPrefab("Music"));
        this.node.addChild(music);
        console.log("Music", music);
        const clip = this.resourceInstance.getMusicFile("audio1");
        this.audioInstance.playMusicClip(clip, true);
    };

    /**
     * This function is used for adding avatars
     */
    addAvatar = () => {
        for (let i = 0; i < 4; i++) {
            const avatar = instantiate(this.avatar);
            this.pageView.content.addChild(avatar);
        }
    };

    /**
     * This function is used for sliding the avatar forward. Button click event is applied on button.
     */
    changeAvatarForward() {
        let currentIndex = this.pageView.getCurrentPageIndex();
        this.pageView.setCurrentPageIndex(currentIndex + 1);

        const clip = this.resourceInstance.getMusicFile("AvatarChanging");
        this.audioInstance.playSoundEffect(clip);
    }

    /**
     * This function is used for sliding the avatar backward. Button click event is applied on button.
     */
    changeAvatarBackWard() {
        let currentIndex = this.pageView.getCurrentPageIndex();
        this.pageView.setCurrentPageIndex(currentIndex - 1);

        const clip = this.resourceInstance.getMusicFile("AvatarChanging");
        this.audioInstance.playSoundEffect(clip);
    }

    /**
     * Changing the scene
     */
    goToModes() {
        console.log("selecmode class call ");

        DataHandler.Instance.loginScreen.getComponent(loginscreen).selectMode();
        // director.loadScene("Modes");
    }

    start() {}

    update(deltaTime: number) {
        this.checkPlayerPos(this.pool1, deltaTime);
    }
}
