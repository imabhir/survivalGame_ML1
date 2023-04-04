import { _decorator, Component, EditBox, instantiate, Label, log, Node, Prefab, tween, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Message')
export class Message extends Component {
    @property({type: Prefab})
    message: Prefab = null;

    @property({type: EditBox})
    EditBoxMessage: EditBox = null;

    @property({type: Node})
    MessageNode: Node = null;

    protected onLoad(): void {
        
    }


    SendMessage(){
        const ReqMessage = this.EditBoxMessage.getComponent(EditBox).string
        const MessageBox = instantiate(this.message)
        // MessageBox.getChildByName("Name").getComponent(Label).string = this.user
        MessageBox.getChildByName("Label").getComponent(Label).string = ReqMessage

        console.log(MessageBox.getChildByName("Label").getComponent(UITransform).width);
        MessageBox.getChildByName("Label").getComponent(Label).updateRenderData(true);
        console.log(MessageBox.getChildByName("Label").getComponent(UITransform).width);

        MessageBox.getComponent(UITransform).height = MessageBox.getChildByName("Label").getComponent(UITransform).height
        this.MessageNode.addChild(MessageBox)
        this.EditBoxMessage.getComponent(EditBox).string = "";
    }


    start() {

    }

    update(deltaTime: number) {
        
    }
}

