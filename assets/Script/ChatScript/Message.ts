import { _decorator, Color, Component, EditBox, instantiate, Label, log, Node, Prefab, ScrollView, Sprite, tween, UITransform, Vec3 } from 'cc';
import { photonmanager } from '../photon/photonmanager';
import { Photonevents } from '../photon/cloud-app-info';
import { color } from 'cc';
const { ccclass, property } = _decorator;



@ccclass('Message')
export class Message extends Component {
  @property({ type: Prefab })
  message: Prefab = null;



  @property({ type: Prefab })
  messages: Prefab = null;
  @property({ type: EditBox })
  EditBoxMessage: EditBox = null;

  @property({ type: Node })
  MessageNode: Node = null;
  colors = [Color.GREEN, Color.CYAN, Color.MAGENTA, Color.YELLOW, Color.BLUE]
  mycolor: Readonly<Color>;
  protected onLoad(): void {
    let a = photonmanager.getInstance().photon_instance
    a.messages = this;
  }


  getcolor(id: number): Color {
    let r = Math.pow((id * 50 + 100), 2) % 255
    let g = Math.pow((id * 40 + 200), 2) % 255
    let b = Math.pow((id * 30 + 300), 2) % 255
    return new Color(r, g, b)
  }


  closechat() {
    this.node.scale = new Vec3(0, 0, 0);
  }
  SendMessage() {
    let id = photonmanager.getInstance().photon_instance.myActor().actorNr
    const ReqMessage = this.EditBoxMessage.getComponent(EditBox).string
    if (ReqMessage.length > 0) {
      const MessageBox = instantiate(this.message)
      const MessageNodes = MessageBox.getChildByName("text")
      const smallText = MessageBox.getChildByName("smallText")

      MessageNodes.getComponent(Label).string = ReqMessage
      MessageNodes.getComponent(Label).updateRenderData(true)
      this.mycolor = this.getcolor(id);


      smallText.getComponent(Label).string = ReqMessage
      smallText.getComponent(Label).color = this.mycolor
      smallText.getComponent(Label).updateRenderData(true)

      let chatSize = MessageBox.getComponent(UITransform).contentSize

      if (MessageNodes.getComponent(UITransform).contentSize.width > smallText.getComponent(UITransform).contentSize.width) {
        MessageBox
          .getComponent(UITransform)
          .setContentSize(
            smallText.getComponent(UITransform).getBoundingBox().width + 30,
            MessageNodes.getComponent(UITransform).getBoundingBox().height + 15
          );
      } else {
        MessageBox
          .getComponent(UITransform)
          .setContentSize(
            chatSize.width,
            MessageNodes.getComponent(UITransform).getBoundingBox().height + 15
          );
      }

      this.MessageNode.addChild(MessageBox)
      this.EditBoxMessage.getComponent(EditBox).string = "";






      photonmanager.getInstance().photon_instance.raiseEvent(Photonevents.Ghostchat, { ReqMessage, color: this.mycolor });
      this.node.getChildByName("ScrollView").getComponent(ScrollView).scrollToBottom();
    }
  }
  onetimemessage = 1
  allmessages() {
    let totalmessages = photonmanager.getInstance().photon_instance.totalmessages
    console.log(totalmessages);

    if (totalmessages.length != 0 && this.onetimemessage) {
      let i = 0;
      while (i < totalmessages.length) {
        this.recievedmessage(totalmessages[i].reqMessage, totalmessages[i].color);
        i++;
      }
      photonmanager.getInstance().photon_instance.totalmessages = []
      this.onetimemessage = 0;
    }
  }
  recievedmessage(messages: any, color) {
    if (this.node.scale.x == 0) {
      photonmanager.getInstance().photon_instance.totalmessages.push(messages)
    }
    else {

      photonmanager.getInstance().photon_instance.totalmessages = []

    }
    const ReqMessage = messages
    const MessageBox = instantiate(this.messages)
    const MessageNodes = MessageBox.getChildByName("text")
    const smallText = MessageBox.getChildByName("smallText")
    MessageNodes.getComponent(Label).string = ReqMessage
    MessageNodes.getComponent(Label).updateRenderData(true)


    smallText.getComponent(Label).string = ReqMessage
    smallText.getComponent(Label).color = color
    smallText.getComponent(Label).updateRenderData(true)

    let chatSize = MessageBox.getComponent(UITransform).contentSize



    if (MessageNodes.getComponent(UITransform).contentSize.width > smallText.getComponent(UITransform).contentSize.width) {
      MessageBox
        .getComponent(UITransform)
        .setContentSize(
          smallText.getComponent(UITransform).getBoundingBox().width + 30,
          MessageNodes.getComponent(UITransform).getBoundingBox().height + 15
        );
    } else {
      MessageBox
        .getComponent(UITransform)
        .setContentSize(
          chatSize.width,
          MessageNodes.getComponent(UITransform).getBoundingBox().height + 15
        );
    }

    this.MessageNode.addChild(MessageBox)
    this.EditBoxMessage.getComponent(EditBox).string = "";
    this.node.getChildByName("ScrollView").getComponent(ScrollView).scrollToBottom();
  }

  start() {

  }

  update(deltaTime: number) {

  }
}

