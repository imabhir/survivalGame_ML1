import { _decorator, Component, Node, director, EditBox, Input, instantiate, Label, Color, tween } from 'cc';
import { gameData } from '../singleton/gameData';
import { resourceManager } from '../singleton/resourceManager';
// import { persistNode } from '../../persistNode';
const { ccclass, property } = _decorator;

@ccclass('login')
export class load extends Component {
    @property({ type: EditBox })
    username: EditBox = null;

    @property({ type: EditBox })
    password: EditBox = null;

    @property({ type: Node })
    LoginButton: Node = null;

    // UserName and Password Format
    obj = {
        "UserNameFormat": "⚫   The number of characters must be between 5 and 15. \n ⚫  The string should only contain alphanumeric characters and/or underscores (_). \n ⚫  The first character of the string should be alphabetic.",

        "PasswordFormat": "⚫  At least one digit, one lowercase letter must be there. \n ⚫  At least one uppercase letter and one special character must be there. \n ⚫  It must be at least 8 characters long."
    }

    resourceInstance = resourceManager.getInstance()
    gameDataInstance = gameData.getInstance()
    PopUp;
    persistNode;
    onLoad() {
        console.log("Started");

        // this.persistNode = director.getScene().getChildByName("PersistNode")
        // this.persistNode.active = false;


        // this.resourceInstance.loadPrefabs()
        // .then((prefab) => {

        this.PopUp = instantiate(this.resourceInstance.GetPrefab("PopUp"))

        this.node.addChild(this.PopUp)
        // })

        // this.scheduleOnce(() => {
        // this.PopUp = instantiate(this.resourceInstance.GetPrefab("PopUp"))
        // console.log("Added Pop Up");

        // this.node.addChild(this.PopUp)
        // }, 0.8)


        // this.persistNode = director.getScene().getChildByName("PersistNode");
        // this.persistNode.active = false;
    }

    // Show UserName Format on click
    ShowUserNameFormat() {
        const pos = this.username.node.getPosition()
        if (this.username.getComponent(EditBox).string == "") {
            console.log(this.PopUp);
            if (this.PopUp != null) {
                this.PopUp.setPosition(pos.x, pos.y - 80)
                this.PopUp.getComponent(Label).color = Color.WHITE
                this.PopUp.getComponent(Label).string = this.obj.UserNameFormat;
            }
        }
    }

    // Show Password Format
    ShowPasswordFormat() {
        const pos = this.password.node.getPosition()
        if (this.password.getComponent(EditBox).string == "") {
            // if(this.PopUp != null){
            this.PopUp.setPosition(pos.x, pos.y - 80)
            this.PopUp.getComponent(Label).color = Color.WHITE
            this.PopUp.getComponent(Label).string = this.obj.PasswordFormat;
            // }
        }
    }

    changeScene() {
        // this.persistNode.active = true
        // tween(this.LoadingIcon).to(2, {angle: -360}).repeatForever().start()

        setTimeout(() => {
            director.loadScene("Avatar")
        }, 1000);
    }

    Validate() {
        let UserNameCheck = this.ValidateUserName()
        let PasswordCheck = this.ValidatePassword()

        if (UserNameCheck && PasswordCheck) {
            const UserName = this.username.getComponent(EditBox).string;
            // Setting username on login
            // this.gameDataInstance.SetUserName(UserName)
            this.gameDataInstance.SetSaveUserName(UserName)

            this.changeScene()
            // director.loadScene("Avatar")
        } else {
            if (!UserNameCheck) {
                const pos = this.username.node.getPosition()
                if (this.PopUp != null) {
                    this.PopUp.setPosition(pos.x, pos.y - 60)

                    this.PopUp.getComponent(Label).string = "Please Enter a valid email to continue"
                    this.PopUp.getComponent(Label).color = Color.RED
                }
            } else {
                const pos = this.password.node.getPosition()
                if (this.PopUp != null) {
                    this.PopUp.setPosition(pos.x, pos.y - 60)

                    this.PopUp.getComponent(Label).string = "Please Enter a valid Password"
                    this.PopUp.getComponent(Label).color = Color.RED
                }
            }
        }
    }

    ValidateUserName() {
        const UserNameRegex = new RegExp('^[A-Za-z]\\w{4,14}$')
        const UserNameString = this.username.getComponent(EditBox).string
        let EditBoxPosition = this.username.node.getPosition()
        if (this.PopUp != null) {
            this.PopUp.setPosition(EditBoxPosition.x, EditBoxPosition.y - 60)
        }

        if (UserNameRegex.test(UserNameString) || 1) {
            this.PopUp.getComponent(Label).string = "Valid"
            this.PopUp.getComponent(Label).color = Color.GREEN
            return true
        } else {
            this.PopUp.getComponent(Label).string = "Please Enter a valid UserName to continue"
            this.PopUp.getComponent(Label).color = Color.RED
            return false;
        }
    }

    ValidatePassword() {
        const PasswordRegex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8,}$")
        const PasswordString = this.password.getComponent(EditBox).string
        let EditBoxPosition = this.password.node.getPosition()
        if (this.PopUp != null) {
            this.PopUp.setPosition(EditBoxPosition.x, EditBoxPosition.y - 60)
        }

        if (PasswordRegex.test(PasswordString) || 1) {
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