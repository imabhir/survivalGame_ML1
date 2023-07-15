import { _decorator, Component, instantiate, Label, log, Node, Prefab, ProgressBar, Tween, tween, Vec3 } from "cc";
import { resourceManager } from "../singleton/resourceManager";
import { DataHandler } from "../singleton/DataHandler";
import { avatarSelection } from "../AvatarSelectionscripts/avatarSelection";
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
    @property({ type: Node })
    loginBtn: Node = null;
    @property({ type: Node })
    loadingNode: Node = null;
    @property({ type: Prefab })
    avatarSelection: Prefab = null;
    @property({ type: Prefab })
    modeSelction: Prefab = null;
    resourceInstance = resourceManager.getInstance();
    flag = true;
    avatarSelectionNode: Node = null;
    modeSelectionNode: Node = null;
    start() {
        DataHandler.Instance.loginScreen = this.node;
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
            this.loginBtn.active = true;
            this.unschedule(this.updateProgress);
            // director.loadScene("Login");
        }

        // this.loadMessage.string = this.resourceInstance.loadingMessage;
        this.Progressbar.getComponent(ProgressBar).progress = percentage / 100;
    }
    login() {
        let forms = instantiate(this.form);

        this.node.addChild(forms);
        // this.button.active = false;

        tween(forms)
            .to(0.2, { scale: new Vec3(1, 1, 1), angle: 360 * 2 })
            .start();
    }
    selectAvatar = () => {
        this.avatarSelectionNode = instantiate(this.avatarSelection);
        this.node.addChild(this.avatarSelectionNode);
    };
    selectMode = () => {
        this.avatarSelectionNode.active = false;
        this.modeSelectionNode = instantiate(this.modeSelction);
        this.node.addChild(this.modeSelectionNode);
    };
    backFromModeSelection = () => {
        this.avatarSelectionNode.active = true;
        this.modeSelectionNode.destroy();
    };
    update(deltaTime: number) {}
}
