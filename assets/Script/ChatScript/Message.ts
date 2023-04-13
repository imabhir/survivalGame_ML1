import { _decorator, Component, EditBox, instantiate, Label, log, Node, Prefab, tween, UITransform, Vec3 } from 'cc';
import { photonmanager } from '../photon/photonmanager';
import { Photonevents } from '../photon/cloud-app-info';
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

  protected onLoad(): void {
    let a = photonmanager.getInstance().photon_instance
    a.messages = this;
  }


  SendMessage() {
    const ReqMessage = this.EditBoxMessage.getComponent(EditBox).string
    const MessageBox = instantiate(this.message)
    const MessageNodes = MessageBox.getChildByName("text")
    const smallText = MessageBox.getChildByName("smallText")

    MessageNodes.getComponent(Label).string = ReqMessage
    MessageNodes.getComponent(Label).updateRenderData(true)


    smallText.getComponent(Label).string = ReqMessage
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






    photonmanager.getInstance().photon_instance.raiseEvent(Photonevents.Ghostchat, { ReqMessage });
  }
  recievedmessage(messages: any) {
    const ReqMessage = messages
    const MessageBox = instantiate(this.messages)
    const MessageNodes = MessageBox.getChildByName("text")
    const smallText = MessageBox.getChildByName("smallText")

    MessageNodes.getComponent(Label).string = ReqMessage
    MessageNodes.getComponent(Label).updateRenderData(true)


    smallText.getComponent(Label).string = ReqMessage
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
  }

  start() {

  }

  update(deltaTime: number) {

  }



  // const { ChatClient } = require("photon-chat");

  // cc.Class({
  // extends: cc.Component,

  // properties: {
  //     appId: "",
  //     userId: "",
  //     roomName: "",
  // },


  // In your Cocos Creator project, create a new script called "ChatManager" or a name of your choice. This script will be responsible for connecting to the chat server, joining a chat room, and sending and receiving messages. 

  // In this script, we create a new instance of the ChatClient class, connect to the chat server using the App ID and User ID, join a chat room using the Room Name, and register callback functions to handle received messages and disconnects. We also define a method to send messages.  

  // onLoad () {
  //     this.chatClient = new ChatClient();
  //     this.chatClient.connect(this.appId, this.userId);
  //     this.chatClient.setonConnectedCallback(() => {
  //         this.chatClient.joinChatRoom(this.roomName);
  //     });
  //     this.chatClient.setonMessageReceivedCallback((userId, message) => {
  //         console.log(userId + " sent: " + message);
  //         // Handle received message here
  //     });
  //     this.chatClient.setOnDisconnectedCallback(() => {
  //         console.log("Disconnected from chat server");
  //         // Handle disconnect here
  //     });
  // },

  // sendMessage(message) {
  //     this.chatClient.sendPublicMessage(this.roomName, message);
  // },




  // Attach the chat manager to a node: Attach the "ChatManager" script to a node in your scene, such as the root node or a dedicated node for chat functionality.

  // Send messages: You can send messages from anywhere in your game by calling the sendMessage method of the chat manager. For example, in a button click event handler:

  // cc.Class({
  //     extends: cc.Component,

  //     properties: {
  //         chatManager: {
  //             default: null,
  //             type: cc.Node,
  //         },
  //     },

  //     sendMessage() {
  //         var message = "Hello world!";
  //         this.chatManager.getComponent("ChatManager").sendMessage(message);
  //     },
  // });


}

