import { _decorator, Component, Node, Graphics, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LevelCreation")
export class LevelCreation extends Component {
  @property({ type: Node })
  imageBackground: Node = null;

  @property({ type: Node })
  imageClone = null;

  MainArray = [];
  obj = { imageBackground: [], imageClone: [] };
  onLoad() {
    this.levelCreation();
  }

  /**
   * Creating json object
   */
  levelCreation = () => {
    this.imageBackground.children.forEach((element) => {
      this.obj["imageBackground"].push({
        x: element.getPosition().x,
        y: element.getPosition().y,
        height: element.getComponent(UITransform).height,
        width: element.getComponent(UITransform).width,
      });
    });

    this.imageClone.children.forEach((element) => {
      this.obj["imageClone"].push({
        x: element.getPosition().x,
        y: element.getPosition().y,
        height: element.getComponent(UITransform).height,
        width: element.getComponent(UITransform).width,
      });
    });
    this.MainArray.push(this.obj);
    console.log(this.MainArray);
  };

  start() {}

  update(deltaTime: number) {}
}
