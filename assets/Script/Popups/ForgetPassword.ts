import { _decorator, Component, EditBox, Node } from "cc";
import { FieldValidator } from "../Common/FieldValidator";
import { loginscreen } from "../loadLogin/loginscreen";
import { DataHandler } from "../singleton/DataHandler";
const { ccclass, property } = _decorator;

@ccclass("ForgetPassword")
export class ForgetPassword extends Component {
    @property({ type: EditBox, displayName: "Otp Editbox" }) otpEb = new EditBox();
    @property({ type: EditBox, displayName: "newPasswordEb Editbox" }) newPasswordEb = new EditBox();
    start() {}
    checkValidation() {
        let isPasswordValid = this.newPasswordEb.getComponent(FieldValidator)!.doValidation(this.newPasswordEb.string);
        let isOtpValid = this.otpEb.string.length >= 4;
        if (isPasswordValid.isValid || isOtpValid) {
            console.log("form data is valid ");
            this.node.active = false;
            DataHandler.Instance.loginScreen.getComponent(loginscreen).selectAvatar();
        }
    }
    closeBtn() {
        this.node.active = false;
        DataHandler.Instance.loginScreen.getComponent(loginscreen).login();
    }
    update(deltaTime: number) {}
}
