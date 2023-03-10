import { _decorator, Component, Node, Prefab, instantiate, UITransform, Graphics } from 'cc';
import { ColorPallete } from './ColorPallete';
const { ccclass, property } = _decorator;

@ccclass('ImageGenerator')
export class ImageGenerator extends Component {
    @property({type: Prefab})
    square: Prefab = null;

    @property({type: Node})
    colorCodes: Node = null;

    rows = 3;
    index = 0;
    onLoad(){
        this.generatePattern()
    }

    generatePattern = () => {
        let colors = this.colorCodes.getComponent(ColorPallete).colorCodes
        console.log(colors);
        
        for(let i=0;i<this.rows;i++){
            // for(let j=0;j<=i;j++){
            const square = instantiate(this.square)
            const squareHeight = square.getComponent(UITransform).height + 10
            const squareWidth = square.getComponent(UITransform).width + 10
            const squarePosition = square.getPosition();
            // if(i != 0 && j == 0){
            //     squarePosition.y+= squareHeight*i
            // }else{
            // }
            const squareGraphics = square.getComponent(Graphics)
            squareGraphics.rect(0, 0, 30, 30)
            squareGraphics.fillColor.fromHEX(colors[this.index++])
            squareGraphics.fill()
            square.setPosition(squarePosition.x + squareWidth*i, squarePosition.y)
            this.node.addChild(square)
            // }
        }
        console.log(this.node.children.length);
        
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

