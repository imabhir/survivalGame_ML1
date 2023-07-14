import { _decorator, Component, Node, Prefab, instantiate, UITransform, Input, director, SpriteFrame, Sprite, log } from 'cc';
import { gameData } from '../singleton/gameData';
// import { gameData } from '../../gameData';
const { ccclass, property } = _decorator;

@ccclass('map')
export class map extends Component {
    @property({ type: Prefab })
    map: Prefab = null;

    @property({ type: Node })
    backButton: Node = null;

    @property({ type: SpriteFrame })
    mapSprite: SpriteFrame = null;

    object = {}

    gameDataInstance;
    TargetMapWithMaxVotes: Node = null;
    onLoad() {
        this.gameDataInstance = gameData.getInstance()
        this.backButton.on(Input.EventType.TOUCH_START, () => {
            this.node.destroy()

        })
        this.mapDisplay()
    }

    /**
     * This function displays all maps in scene
     */
    mapDisplay = () => {
        for (let i = 0; i < 4; i++) {
            const map = instantiate(this.map);
            const mapWidth = map.getComponent(UITransform).width + 20
            const mapHeight = map.getComponent(UITransform).height + 20
            const mapPos = map.getPosition();
            map.setPosition(mapPos.x + mapWidth * i, mapPos.y)
            if (i % 2 == 0) {
                map.getComponent(Sprite).spriteFrame = this.mapSprite
            }
            map.on(Input.EventType.TOUCH_START, this.setMap)
            map.name = `map${i}`
            this.object[map.name] = 0;
            this.node.addChild(map)
        }
    }


    setMap = (event) => {
        this.object[event.target.name]++;
        this.check()
    }

    check = () => {
        let mapWithMaxVotes: string;
        let maxx = 0;
        for (const key in this.object) {
            if (this.object[key] > maxx) {
                maxx = Math.max(maxx, this.object[key])
                mapWithMaxVotes = key;
            }
        }
        this.findMapNode(mapWithMaxVotes);
    }

    findMapNode = (mapWithMaxVotes) => {
        this.node.children.forEach((element) => {
            if (element.name == mapWithMaxVotes) {
                this.TargetMapWithMaxVotes = element
            }
        })
        console.log("Target Map", this.TargetMapWithMaxVotes);
        let node = instantiate(this.TargetMapWithMaxVotes);
        // console.log("Node", node);
        this.gameDataInstance.initMapWithMaxVotes(node)
        this.node.destroy()
    }

    start() {

    }

    update(deltaTime: number) {

    }
}

