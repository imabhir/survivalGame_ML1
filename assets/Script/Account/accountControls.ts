import { _decorator, Component, Node, Canvas, Input, Label, EditBox, director } from 'cc';
import { gameData } from '../singleton/gameData';
const { ccclass, property } = _decorator;

@ccclass('accountControls')
export class accountControls extends Component {
    @property({ type: Node })
    closeButton: Node = null;

    @property({ type: EditBox })
    UserName: EditBox = null;

    gameDataInstance = gameData.getInstance()
    onLoad() {
        this.UserName.getComponent(EditBox).string = this.gameDataInstance.GetSaveUserName()
        this.closeButton.on(Input.EventType.TOUCH_START, () => {
            setTimeout(() => {
                this.node.destroy()
            });
        })
    }

    MakeUserNameFieldActive() {
        // Make the editbox active on click of a button
        this.UserName.focus()
    }

    EditUserName() {
        this.gameDataInstance.SetSaveUserName(this.UserName.getComponent(EditBox).string)
        this.UserName.getComponent(EditBox).string = this.gameDataInstance.GetSaveUserName()
    }

    start() {
        console.log("Started");
    }

    update(deltaTime: number) {

    }
}
