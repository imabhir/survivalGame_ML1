import { _decorator, Component, Node, Prefab, instantiate, UITransform, Graphics, JsonAsset } from 'cc';
import { ColorPallete } from './ColorPallete';
const { ccclass, property } = _decorator;

@ccclass('ImageGenerator')
export class ImageGenerator extends Component {
    @property({type: Prefab})
    square: Prefab = null;

    @property({type: Node})
    colorCodes: Node = null;

    @property({type: JsonAsset})
    level: JsonAsset = null;

    @property({type: JsonAsset})
    get levelData(){
        return this.level;
    }
    set levelData(value){
        this.level = value;
    }

    index = 0;
    onLoad(){
        this.generateImage()
    }

    /**
     * This function is used to generate the image as per the level from the json file
     */
    generateImage = () => {
        let colors = this.colorCodes.getComponent(ColorPallete).colorCodes
        this.level.json.forEach((element) => {
            const imageElements = element.imageBackground
            imageElements.forEach((element) => {
                const square = instantiate(this.square)
                square.getComponent(UITransform).height = element.height
                square.getComponent(UITransform).width = element.width

                const squareGraphics = square.getComponent(Graphics)
                squareGraphics.rect(0, 0, 30, 30)
                squareGraphics.fillColor.fromHEX(colors[this.index++])
                squareGraphics.fill()
                square.setPosition(element.x, element.y)
                this.node.addChild(square)
                if(this.index == colors.length){
                    this.index = 0
                }
            })
        })
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

