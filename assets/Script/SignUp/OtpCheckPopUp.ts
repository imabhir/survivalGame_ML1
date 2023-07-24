import { _decorator, Component, log, Node } from "cc";
import { SignUpPopUp } from "./SignUpPopUp";
import { loginscreen } from "../loadLogin/loginscreen";
import { DataHandler } from "../singleton/DataHandler";
const { ccclass, property } = _decorator;

@ccclass("OtpCheckPopUp")
export class OtpCheckPopUp extends Component {
    start() {}
    backBtnClick() {
        console.log("back btn click ");

        DataHandler.Instance.loginScreen.getComponent(loginscreen).backFromOtpPanel();
    }
    continueBtnClick() {
        // api call for otp check
        DataHandler.Instance.loginScreen.getComponent(loginscreen).selectAvatar();
    }
    update(deltaTime: number) {}
}
