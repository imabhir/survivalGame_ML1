import { _decorator, Component, Node, Prefab, instantiate, UITransform, Input, director } from 'cc';
import { gameData } from '../../singleton/gameData';
// import { gameData } from '../../gameData';
const { ccclass, property } = _decorator;

@ccclass('map')
export class map extends Component {
    @property({type: Prefab})
    map: Prefab = null;

    @property({type: Node})
    backButton: Node = null;
    

    object = {}

    gameDataInstance;
    // targetMapWithMaxVotes: Node = null;
    onLoad(){
        this.gameDataInstance = gameData.getInstance()
        this.backButton.on(Input.EventType.TOUCH_START, () => {
            director.loadScene("playersLobby")
        })
        this.mapDisplay()
    }

    /**
     * This function displays all maps in scene
     */

    mapDisplay = () => {
        for(let i=0;i<4;i++){
            const map = instantiate(this.map);
            const mapWidth = map.getComponent(UITransform).width + 20
            const mapHeight = map.getComponent(UITransform).height + 20
            const mapPos = map.getPosition();
            map.setPosition(mapPos.x + mapWidth*i, mapPos.y)
            map.on(Input.EventType.TOUCH_START, this.setMap)
            map.name = `map${i}`
            this.object[map.name] = 0;
            this.node.addChild(map)
        }
    }


    setMap = (event) => {
        this.object[event.target.name]++;
        // this.check()
    }

    // check = () => {
    //     let mapWithMaxVotes: string;
    //     let maxx = 0;
    //     for(const key in this.object){
    //         if(this.object[key] > maxx){
    //             maxx = Math.max(maxx, this.object[key])
    //             mapWithMaxVotes = key;
    //         }
    //     }
        
    //     this.findMapNode(mapWithMaxVotes);
    // }

    // findMapNode = (mapWithMaxVotes) => {
    //     this.node.children.forEach((element) => {
    //         if(element.name == mapWithMaxVotes){
    //             this.targetMapWithMaxVotes = element
    //         }
    //     })
    //     console.log(this.targetMapWithMaxVotes);
    //     this.gameDataInstance.initMapWithMaxVotes(this.targetMapWithMaxVotes)
    // }

    start() {
        
    }

    update(deltaTime: number) {
        
    }
}

