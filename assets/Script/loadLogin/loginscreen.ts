import {
    _decorator,
    Button,
    Component,
    instantiate,
    Label,
    log,
    Node,
    Prefab,
    ProgressBar,
    Tween,
    tween,
    Vec3,
} from "cc";
import { resourceManager } from "../singleton/resourceManager";
import { DataHandler } from "../singleton/DataHandler";
import { avatarSelection } from "../AvatarSelectionscripts/avatarSelection";
import { login } from "./load";
import { LocAndSessStoreManager } from "../Common/managers/LocAndSessStoreManager";
const { ccclass, property } = _decorator;

@ccclass("loginscreen")
export class loginscreen extends Component {
    @property({ type: Prefab })
    form: Prefab;
    @property({ type: Node })
    button: Node;
    @property(ProgressBar)
    Progressbar: ProgressBar = null;
    @property(Label)
    loadMessage: Label = null;
    @property({ type: Button })
    loginBtn: Button = null;
    @property({ type: Node })
    loadingNode: Node = null;
    @property({ type: Prefab })
    avatarSelection: Prefab = null;
    @property({ type: Prefab })
    modeSelction: Prefab = null;
    @property({ type: Prefab })
    signUpPanel: Prefab = null;
    @property({ type: Prefab })
    otpPanel: Prefab = null;
    resourceInstance = resourceManager.getInstance();
    flag = true;
    avatarSelectionNode: Node = null;
    modeSelectionNode: Node = null;
    signUpPanelNode: Node = null;
    otpPanelNode: Node = null;
    loginNode: Node = null;
    protected onLoad(): void {
        DataHandler.Instance.loginScreen = this.node;
    }
    start() {
        setTimeout(() => {
            this.resourceInstance.loadMusic().then((audios) => {
                console.log("Music Loaded", audios);
            });

            this.resourceInstance.loadPrefabs().then((prefabs) => {
                console.log("Prefabs Loaded", prefabs);
            });
            console.log("Scene Loaded");
        }, 2000);
        this.schedule(this.updateProgress, 0.2);
    }
    updateProgress() {
        let percentage = (this.resourceInstance.loadPercentage / this.resourceInstance.totalItems) * 100;
        if (percentage == 100 && this.flag) {
            this.flag = false;
            console.log("Change Scene To Login");
            this.loadingNode.active = false;
            this.loginBtn.node.active = true;

            this.unschedule(this.updateProgress);
            // director.loadScene("Login");
        }

        // this.loadMessage.string = this.resourceInstance.loadingMessage;
        this.Progressbar.getComponent(ProgressBar).progress = percentage / 100;
    }
    login() {
        if (LocAndSessStoreManager.Instance.getData("login") == "") {
            this.loginBtn.interactable = false;
            // if (LocAndSessStoreManager.Instance.getData("token")) {

            // let forms = instantiate(this.form);
            // this.node.addChild(forms);
            // // forms.getComponent(login);
            // tween(forms)
            //     .to(0.2, { scale: new Vec3(1, 1, 1), angle: 360 * 2 })
            //     .start();
            // } else {
            //     console.log("signUp");
            this.signUpPanelNode = instantiate(this.signUpPanel);
            this.node.addChild(this.signUpPanelNode);
            tween(this.signUpPanelNode)
                .to(0.2, { scale: new Vec3(1, 1, 1), angle: 360 * 2 })
                .start();
            // }
        } else {
            this.selectAvatar();
        }
    }
    loginPanel() {
        this.loginNode = instantiate(this.form);
        this.node.addChild(this.loginNode);
        // forms.getComponent(login);
        tween(this.loginNode)
            .to(0.2, { scale: new Vec3(1, 1, 1), angle: 360 * 2 })
            .start();
    }
    otpCheckNode() {
        this.signUpPanelNode.active = false;
        if (this.otpPanelNode) {
            this.otpPanelNode.active = true;
        } else {
            this.otpPanelNode = instantiate(this.otpPanel);
            this.node.addChild(this.otpPanelNode);
        }
    }
    backFromOtpPanel() {
        console.log("loginscreen function call ");

        this.otpPanelNode.active = false;
        this.signUpPanelNode.active = true;
    }

    selectAvatar = () => {
        if (!this.avatarSelectionNode) {
            this.avatarSelectionNode = instantiate(this.avatarSelection);
            this.node.addChild(this.avatarSelectionNode);
        } else {
            this.avatarSelectionNode.active = true;
        }
    };
    selectMode = () => {
        console.log("inside select mode ");

        if (!this.modeSelectionNode) {
            this.modeSelectionNode = instantiate(this.modeSelction);
            this.node.addChild(this.modeSelectionNode);
        } else {
            this.modeSelectionNode.active = true;
        }
        this.avatarSelectionNode.active = false;
    };
    backFromModeSelection = () => {
        this.avatarSelectionNode.active = true;
        this.modeSelectionNode.active = false;
    };
    activeLoginBtn() {
        this.loginBtn.interactable = true;
    }
    update(deltaTime: number) {}
}
