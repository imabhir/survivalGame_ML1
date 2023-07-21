import { _decorator, Button, Color, Component, EditBox, log, Node, Sprite } from "cc";
import { loginscreen } from "../loadLogin/loginscreen";
import { DataHandler } from "../singleton/DataHandler";
import { FieldValidator } from "../Common/FieldValidator";
import { API_END_POINTS, REQUEST_TYPE } from "../Common/Network/NetworkConfig";
import { NetworkManager } from "../Common/Network/NetworkManager";

const { ccclass, property } = _decorator;

@ccclass("SignUpPopUp")
export class SignUpPopUp extends Component {
    @property({ type: EditBox, displayName: "Email Editbox" }) emailEb = new EditBox();
    @property({ type: EditBox, displayName: "Username Editbox" }) usernameEb = new EditBox();
    @property({ type: EditBox, displayName: "Password Editbox" }) passwordEb = new EditBox();
    @property({ type: Node })
    signUpPanel: Node = null;

    start() {}
    checkValidation() {
        let isUserNameValid = this.usernameEb.getComponent(FieldValidator)!.doValidation(this.usernameEb.string.trim());
        let isPasswordValid = this.passwordEb.getComponent(FieldValidator)!.doValidation(this.passwordEb.string);
        let isEmailValid = this.emailEb
            .getComponent(FieldValidator)!
            .doValidation(this.emailEb.string.toLowerCase().trim());
        console.log(isEmailValid, isPasswordValid, isUserNameValid);

        if (isEmailValid.isValid || isPasswordValid.isValid || isUserNameValid.isValid) {
            console.log("form data is valid ");
            DataHandler.Instance.loginScreen.getComponent(loginscreen).otpCheckNode();
            // this.node.active = false;
            // DataHandler.Instance.loginScreen.getComponent(loginscreen).selectAvatar();
        }
    }

    signUpBTnCLick() {
        // if()
    }

    continueBtnClick() {
        this.node.active = false;
        DataHandler.Instance.loginScreen.getComponent(loginscreen).selectAvatar();
    }

    checkEmail(email: string) {
        let userData = {
            email: this.emailEb.string.toLowerCase().trim(),
            userName: this.usernameEb.string,
            password: this.passwordEb.string,
        };
        let onSuccess = (data) => {
            data = JSON.parse(data);
            console.log("signUp complete");
        };
        let onError = (data = null) => {
            data = JSON.parse(data);
            console.log("error during child add ", data.error);
        };

        NetworkManager.getInstance().sendRequest(
            API_END_POINTS.REGISTER,
            REQUEST_TYPE.POST,
            userData,
            onSuccess,
            onError,
            false
        );
    }
    update(deltaTime: number) {}
}
