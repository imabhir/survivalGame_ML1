import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DataHandler")
export class DataHandler extends Component {
    private loginScreenRef: any = null;
    private static _instance: DataHandler;
    static get Instance(): DataHandler {
        if (!DataHandler._instance) {
            DataHandler._instance = new DataHandler();
        }
        return DataHandler._instance;
    }
    set loginScreen(loginScreenRef: any) {
        this.loginScreenRef = loginScreenRef;
    }
    get loginScreen(): any {
        return this.loginScreenRef;
    }
}
