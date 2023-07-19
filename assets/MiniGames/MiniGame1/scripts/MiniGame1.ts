import {
  _decorator,
  Component,
  Node,
  Input,
  UITransform,
  Prefab,
  JsonAsset,
  instantiate,
  Vec3,
  randomRange,
  random,
  randomRangeInt,
} from "cc";
import { itemDataType, ITEM_TYPE, levelItem } from "./levelItem";
import { photonmanager } from "../../../Script/photon/photonmanager";
const { ccclass, property } = _decorator;

@ccclass("MiniGame1")
export class MiniGame1 extends Component {
  @property({ type: Prefab })
  thunder: Prefab = null;

  @property({ type: Prefab })
  bulb: Prefab = null;

  @property({ type: Prefab })
  stick: Prefab = null;

  @property({ type: JsonAsset })
  positions: JsonAsset = null;

  @property({ type: Node })
  closebutton: Node = null;

  @property({ type: Node })
  taskCompleted: Node = null;

  @property({ type: JsonAsset })
  get levelData() {
    return this.positions;
  }
  set levelData(value) {
    this.positions = value;
    this.node.destroyAllChildren();
    // this.updateLevel(this.positions.json)
  }

  onLoad() {
    this.taskCompleted.active = false;
    this.closebutton.on(Input.EventType.TOUCH_START, this.closeGame);
    this.updateLevel(this.positions.json);
    // this.node.addChild(this.thunder);
    // this.thunder.setPosition(this.positions.json[0].obj.x, this.positions.json[0].obj.y)
    // this.thunder.angle = this.positions.json[0].angle;
    // this.node.parent.getChildByName("completed").active = false;
    // this.sticks();
  }

  closeGame = () => {
    setTimeout(() => {
      this.node.parent.destroy();
      this.node.destroy();
      this.taskCompleted.destroy();
      this.closebutton.destroy();
    });
  };

  // sticks = () => {
  //     let len = this.positions.json.length
  //     for(let i=1;i<=this.number;i++){
  //         const stick = instantiate(this.stick);
  //         stick.setPosition(this.positions.json[i].obj.x, this.positions.json[i].obj.y)
  //         stick.on(Input.EventType.TOUCH_START, this.rotate)
  //         stick.angle = this.angle[i-1]
  //         this.node.addChild(stick);
  //     }
  //     this.node.addChild(this.bulb)
  //     this.bulb.setPosition(this.positions.json[len-1].obj.x, this.positions.json[len-1].obj.y)
  //     this.bulb.angle = this.positions.json[len-1].angle;
  // }

  // rotate = (event) => {
  //     event.target.angle+= 90;
  //     // let position = event.target.getPosition();
  //     this.check(event.target)
  // }

  // check = (target) => {
  //     let arr = this.node.children;
  //     let len = 0;
  //     arr.forEach((element, index) => {
  //         if(target == element){
  //             if(target.angle == this.positions.json[index].angle){
  //                 len++;
  //             }
  //             if(len == this.number){
  //                 this.node.parent.getChildByName("completed").active = true;
  //             }
  //         }
  //     })
  // }

  updateLevel = (itemsInfo: itemDataType[]) => {
    /**
     * Iterating the json file and checking each asset's types and creating the instance according to the type
     */
    itemsInfo.forEach((element) => {
      let item: Node = null;
      switch (element.itemType) {
        case ITEM_TYPE.BEGIN:
          {
            console.log("Thunder");

            item = instantiate(this.thunder);
          }
          break;
        case ITEM_TYPE.END:
          {
            console.log("Bulb");

            item = instantiate(this.bulb);
          }
          break;
        case ITEM_TYPE.L_SHAPED:
          {
            console.log("stickL");
            item = instantiate(this.stick);
          }
          break;
        case ITEM_TYPE.STRAIGHT:
          {
            console.log("stickS");
            item = instantiate(this.stick);
          }
          break;
      }
      // Setting the properties
      if (item) {
        item.setPosition(new Vec3(element.obj.x, element.obj.y, element.obj.z));
        // item.setPosition(Vec3.ZERO);
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
      this.node.parent.getChildByName("completed").active = true;
      setTimeout(() => {
        photonmanager.getInstance().photon_instance.myRoom().setCustomProperty("Minigame1", true);

        this.node.parent.destroy();
      }, 1000);
    } else {
      this.node.parent.getChildByName("completed").active = false;
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
    // console.log(flag);
    return flag;
  };

  start() {}

  update(deltaTime: number) {}
}
