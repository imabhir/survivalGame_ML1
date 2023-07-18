import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  UITransform,
  Input,
  director,
  SpriteFrame,
  Sprite,
  log,
} from "cc";
import { gameData } from "../singleton/gameData";
// import { gameData } from '../../gameData';
const { ccclass, property } = _decorator;

@ccclass("map")
export class map extends Component {
  @property({ type: Prefab })
  map: Prefab = null;
  @property({ type: Prefab })
  goldenBorder: Prefab = null;
  @property({ type: Node })
  backButton: Node = null;

  @property({ type: SpriteFrame })
  mapSprite: SpriteFrame = null;
  Border: Node = null;
  object = {};
  mapWithMaxVotes: any = null;
  gameDataInstance;
  TargetMapWithMaxVotes: Node = null;
  selected: boolean = false;
  onLoad() {
    this.gameDataInstance = gameData.getInstance();
    // this.backButton.on(Input.EventType.TOUCH_START, () => {
    //   this.node.destroy();
    // });
    this.Border = instantiate(this.goldenBorder);
    this.mapDisplay();
  }
  backButtonPressed() {
    this.node.active = false;
  }
  submitButtonPressed() {
    if (this.selected) {
      console.log("Submit Pressed");
      this.findMapNode(this.mapWithMaxVotes);
      this.node.active = false;
    }
  }
  /**
   * This function displays all maps in scene
   */
  mapDisplay = () => {
    console.log("inside display");
    for (let i = 0; i < 4; i++) {
      const map = instantiate(this.map);
      const mapWidth = map.getComponent(UITransform).width + 20;
      const mapHeight = map.getComponent(UITransform).height + 20;
      const mapPos = map.getPosition();
      map.setPosition(mapPos.x + mapWidth * i, mapPos.y);
      if (i % 2 == 0) {
        map.getComponent(Sprite).spriteFrame = this.mapSprite;
      }
      map.on(Input.EventType.TOUCH_START, this.setMap);
      map.name = `map${i}`;
      this.object[map.name] = 0;
      this.node.addChild(map);
    }
  };

  setMap = (event) => {
    // clickMode = (element, toggleButton, event) => {
    // let Border = null;
    // this.Border;
    this.Border.removeFromParent();
    this.Border.getComponent(UITransform).height = event.target.height;
    this.Border.getComponent(UITransform).width = event.target.width;
    event.target.addChild(this.Border);
    this.selected = true;
    //   }
    // toggleButton.getComponent(Toggle).isChecked = true;
    // // toggleButton.active = true;
    // this.EnterButton.on(Input.EventType.TOUCH_START, () => {
    //   this.enterMode(element);
    // });

    // this.checkIfOtherModeSelected(event, toggleButton);
    // };
    // if (this.object[event.target.name] > 0) {
    //   console.log("Map Inc", this.object[event.target.name]);
    // } else {
    this.object[event.target.name] += 1;
    let selectedObj = this.object[event.target.name];
    // for (const key in this.object) {
    //   // console.log("Check Method in Map.ts", this.object[key]);
    //   if (this.object[key] == selectedObj) {
    //   } else {
    //     if (this.object[key] > 0) {
    //       console.log("Decrementing Value");
    //       //   this.object[event.target.name] -= 1;
    //       this.object[key] -= 1;
    //     }
    //     //   this.object[event.target.name] = 0;
    //   }
    // }
    // }
    console.log("Map Count", this.object);

    this.check();
  };

  check = () => {
    // let mapWithMaxVotes: string;
    let maxx = 0;
    for (const key in this.object) {
      console.log("Check Method in Map.ts", this.object[key]);
      if (this.object[key] > maxx) {
        maxx = Math.max(maxx, this.object[key]);
        this.mapWithMaxVotes = key;
      }
    }
    // this.findMapNode(mapWithMaxVotes);
  };

  findMapNode = (mapWithMaxVotes) => {
    this.node.children.forEach((element) => {
      if (element.name == mapWithMaxVotes) {
        this.TargetMapWithMaxVotes = element;
      }
    });
    console.log("Target Map", this.TargetMapWithMaxVotes);
    let node = instantiate(this.TargetMapWithMaxVotes);
    // console.log("Node", node);
    this.gameDataInstance.initMapWithMaxVotes(node);
    // this.node.destroy();
  };

  start() {}

  update(deltaTime: number) {}
}
