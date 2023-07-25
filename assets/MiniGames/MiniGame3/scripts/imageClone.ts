import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  UITransform,
  Sprite,
  Input,
  Graphics,
  JsonAsset,
  SpriteFrame,
  Color,
} from "cc";
import { ColorPallete } from "./ColorPallete";
import { ImageGenerator } from "./ImageGenerator";
import { photonmanager } from "../../../Script/photon/photonmanager";
const { ccclass, property } = _decorator;

@ccclass("imageClone")
export class imageClone extends Component {
  @property({ type: Prefab }) whiteSquare: Prefab = null;
  @property({ type: Node }) colorPallete: Node = null;
  @property({ type: Node }) imageBackground: Node = null;
  @property({ type: Node }) taskCompleted: Node = null;
  @property({ type: SpriteFrame }) Incorrect: SpriteFrame = null;
  @property({ type: Node }) closeButton: Node = null;
  @property({ type: Node }) parentNode: Node = null;

  defaultColor: Color = Color.WHITE;
  // Variable for checking if all the colors are filled in white squares
  check: number = 0;
  // Used for Storing json file
  level: JsonAsset = null;
  onLoad() {
    this.taskCompleted.active = false;
    this.closeButton.on(Input.EventType.TOUCH_START, () => {
      this.parentNode.destroy();

      this.closeButton.destroy();
    });
    this.generateImageClone();
  }

  /**
   * This function traverses the json file's 'imageClone element' and place all transparent squares at their postion as per level
   */
  generateImageClone = () => {
    this.level = this.imageBackground.getComponent(ImageGenerator).level;
    this.level.json.forEach((element) => {
      const imageCloneElements = element.imageClone;
      imageCloneElements.forEach((element) => {
        const whiteSquare = instantiate(this.whiteSquare);
        whiteSquare.getComponent(UITransform).height = element.height;
        whiteSquare.getComponent(UITransform).width = element.width;

        whiteSquare.on(Input.EventType.TOUCH_START, this.fillColor);
        whiteSquare.setPosition(element.x, element.y);
        this.node.addChild(whiteSquare);
      });
    });
  };

  /**
   *
   * @param event fills color as the touch event happens
   */
  fillColor = (event) => {
    if (this.colorPallete.getComponent(ColorPallete).pickedColor != null) {
      if (event.target.getComponent(Sprite).color._val == this.defaultColor._val) {
        this.check++;
      }
      event.target.getComponent(Sprite).color = this.colorPallete.getComponent(ColorPallete).pickedColor;
      console.log(this.check);
    }

    if (this.check == this.node.children.length) {
      this.checkIfRight();
    }
  };
  checkIfRight = () => {
    let flag = true;
    for (let i = 0; i < this.node.children.length; i++) {
      if (
        this.node.children[i].getComponent(Sprite).color._val !=
        this.imageBackground.children[i].getComponent(Graphics).fillColor._val
      ) {
        flag = false;
        break;
      }
    }

    if (flag) {
      setTimeout(() => {
        photonmanager.Instance.photon_instance.myRoom().setCustomProperty("Minigame3", true);

        this.parentNode.destroy();
      }, 1000);
      this.taskCompleted.active = true;
    } else {
      this.taskCompleted.active = true;
      setTimeout(() => {
        this.parentNode.destroy();
      }, 1000);
      this.taskCompleted.getComponent(Sprite).spriteFrame = this.Incorrect;
    }
  };
  start() {}

  update(deltaTime: number) {}
}
