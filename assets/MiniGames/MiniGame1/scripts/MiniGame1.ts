import { _decorator, Component, Node, Input, Prefab, JsonAsset, instantiate, Vec3, randomRangeInt } from "cc";
import { itemDataType, ITEM_TYPE, levelItem } from "./levelItem";
import { photonmanager } from "../../../Script/photon/photonmanager";
const { ccclass, property } = _decorator;

@ccclass("MiniGame1")
export class MiniGame1 extends Component {
  @property({ type: Prefab }) thunder: Prefab = null;
  @property({ type: Prefab }) bulb: Prefab = null;
  @property({ type: Prefab }) stick: Prefab = null;
  @property({ type: JsonAsset }) positions: JsonAsset = null;
  @property({ type: Node }) closebutton: Node = null;
  @property({ type: Node }) taskCompleted: Node = null;
  @property({ type: JsonAsset })
  get levelData() {
    return this.positions;
  }
  set levelData(value) {
    this.positions = value;
    this.node.destroyAllChildren();
  }

  onLoad() {
    this.taskCompleted.active = false;
    this.closebutton.on(Input.EventType.TOUCH_START, this.closeGame);
    this.updateLevel(this.positions.json);
  }

  closeGame = () => {
    setTimeout(() => {
      this.node.parent.destroy();
      this.node.destroy();
      this.taskCompleted.destroy();
      this.closebutton.destroy();
    });
  };
  updateLevel = (itemsInfo: itemDataType[]) => {
    /**
     * Iterating the json file and checking each asset's types and creating the instance according to the type
     */
    itemsInfo.forEach((element) => {
      let item: Node = null;
      switch (element.itemType) {
        case ITEM_TYPE.BEGIN:
          {
            item = instantiate(this.thunder);
          }
          break;
        case ITEM_TYPE.END:
          {
            item = instantiate(this.bulb);
          }
          break;
        case ITEM_TYPE.L_SHAPED:
          {
            item = instantiate(this.stick);
          }
          break;
        case ITEM_TYPE.STRAIGHT:
          {
            item = instantiate(this.stick);
          }
          break;
      }
      // Setting the properties
      if (item) {
        item.setPosition(new Vec3(element.obj.x, element.obj.y, element.obj.z));
        item.getComponent(levelItem).resultantAngle = element.angle;
        item.getComponent(levelItem).isFixed = element.isFixed;
        this.node.addChild(item);
      }
    });
    this.randomize();
  };

  /**
   * Randomly placing the sticks either through an angle 0 or 90
   */
  randomize = () => {
    do {
      this.node.children.forEach((element, index) => {
        if (!element.getComponent(levelItem).isFixed) {
          element.angle = randomRangeInt(0, 2) * 90;

          // Touch event on items which are not fixed
          element.on(Input.EventType.TOUCH_START, this.checkPos);
        } else {
          element.angle = this.positions.json[index].angle;
        }
      });
    } while (this.gameCompleted());
  };

  /**
   *
   * @param event Touch event on sticks
   * This function rotates the stick either through 0 or 90
   */
  checkPos = (event) => {
    if (event.target.angle == 0) {
      event.target.angle = 90;
    } else if (event.target.angle == 90) {
      event.target.angle = 0;
    }

    if (this.gameCompleted()) {
      this.taskCompleted.active = true;
      setTimeout(() => {
        photonmanager.Instance.photon_instance.myRoom().setCustomProperty("Minigame1", true);

        this.node.parent.destroy();
      }, 1000);
    } else {
      this.taskCompleted.active = false;
    }
  };

  /**
   *
   * @returns a boolean variable indicating whether our game is over
   */
  gameCompleted = () => {
    let flag = true;
    this.node.children.forEach((element) => {
      if (element.angle != element.getComponent(levelItem).resultantAngle) {
        flag = false;
      }
    });
    return flag;
  };

  start() {}

  update(deltaTime: number) {}
}
