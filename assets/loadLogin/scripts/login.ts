import { _decorator, Component, Node, director, EditBox, Input, instantiate, Label, Color } from 'cc';
import { resourceManager } from '../../singleton/resourceManager';
const { ccclass, property } = _decorator;

@ccclass('login')
export class load extends Component {
    @property({ type: EditBox })
    username: EditBox = null;

    @property({ type: EditBox })
    password: EditBox = null;

    @property({ type: Node })
    LoginButton: Node = null;


    obj = {
        "UserNameFormat": "⚫   The number of characters must be between 5 and 15. \n ⚫  The string should only contain alphanumeric characters and/or underscores (_). \n ⚫  The first character of the string should be alphabetic.",

        "PasswordFormat": "⚫  At least one digit, one lowercase letter must be there. \n ⚫  At least one uppercase letter and one special character must be there. \n ⚫  It must be 8 characters long."
    }

    resourceInstance = resourceManager.getInstance()
    PopUp;
    onLoad() {
        this.resourceInstance.loadPrefabs()
        this.scheduleOnce(() => {
            this.PopUp = instantiate(this.resourceInstance.getPopUp("PopUp"))
            this.node.addChild(this.PopUp)
        }, 0.4)


    }

    ShowUserNameFormat() {
        const pos = this.username.node.getPosition()
        if (this.username.getComponent(EditBox).string == "") {
            this.PopUp.setPosition(pos.x, pos.y - 80)
            this.PopUp.getComponent(Label).color = Color.WHITE
            this.PopUp.getComponent(Label).string = this.obj.UserNameFormat;
        }
    }

    ShowPasswordFormat() {
        const pos = this.password.node.getPosition()
        if (this.password.getComponent(EditBox).string == "") {
            this.PopUp.setPosition(pos.x, pos.y - 80)
            this.PopUp.getComponent(Label).color = Color.WHITE
            this.PopUp.getComponent(Label).string = this.obj.PasswordFormat;
        }
    }

    Validate() {
        let UserNameCheck = this.ValidateUserName()
        let PasswordCheck = this.ValidatePassword()

        if (UserNameCheck && PasswordCheck) {
            director.loadScene("Avatar")
        } else {
            if (!UserNameCheck) {
                const pos = this.username.node.getPosition()
                this.PopUp.setPosition(pos.x, pos.y - 60)

                this.PopUp.getComponent(Label).string = "Please Enter a valid email to continue"
                this.PopUp.getComponent(Label).color = Color.RED
            } else {
                const pos = this.password.node.getPosition()
                this.PopUp.setPosition(pos.x, pos.y - 60)

                this.PopUp.getComponent(Label).string = "Please Enter a valid Password"
                this.PopUp.getComponent(Label).color = Color.RED
            }
        }
    }

    ValidateUserName() {
        const UserNameRegex = new RegExp('^[A-Za-z]\\w{4,14}$')
        const UserNameString = this.username.getComponent(EditBox).string
        let EditBoxPosition = this.username.node.getPosition()
        this.PopUp.setPosition(EditBoxPosition.x, EditBoxPosition.y - 60)

        if (UserNameRegex.test(UserNameString)) {
            this.PopUp.getComponent(Label).string = "Valid"
            this.PopUp.getComponent(Label).color = Color.GREEN
            return true
        } else {
            this.PopUp.getComponent(Label).string = "Please Enter a valid email to continue"
            this.PopUp.getComponent(Label).color = Color.RED
            return false;
        }
    }

    ValidatePassword() {
        const PasswordRegex = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8,}$')
        const PasswordString = this.password.getComponent(EditBox).string
        let EditBoxPosition = this.password.node.getPosition()
        this.PopUp.setPosition(EditBoxPosition.x, EditBoxPosition.y - 60)

        if (PasswordRegex.test(PasswordString)) {
            this.PopUp.getComponent(Label).string = "Valid"
            this.PopUp.getComponent(Label).color = Color.GREEN
            return true
        } else {
            this.PopUp.getComponent(Label).string = "Please Enter a valid Password"
            this.PopUp.getComponent(Label).color = Color.RED
            return false;
        }
    }


    start() {

    }

    update(deltaTime: number) {

    }
}