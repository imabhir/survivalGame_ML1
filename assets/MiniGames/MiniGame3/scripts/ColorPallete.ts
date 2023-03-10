import { _decorator, Component, Node, Prefab, instantiate, Graphics, UITransform, Input, Sprite } from 'cc';
// import { type } from 'os';
const { ccclass, property } = _decorator;

@ccclass('ColorPallete')
export class ColorPallete extends Component {
    @property({type: Prefab})
    color: Prefab = null;

    colorCodes = ["7FFF00", "ADFF2F", "FF0000", "00FF7F", "00FF7F", "#FF7F50", "#FFD700", "#FF8C00"]
    index = 0;
    onLoad(){
        for(let i=0;i<this.colorCodes.length;i++){
            const color = instantiate(this.color)
            const colorPosition = color.getPosition()
            const parentHeight = this.node.getComponent(UITransform).height
            const colorWidth = color.getComponent(UITransform).width + 20
            const colorGraphics = color.getComponent(Graphics)
            colorGraphics.circle(0, 0, parentHeight/3)
            colorGraphics.fillColor.fromHEX(this.colorCodes[this.index++])
            colorGraphics.fill();
            
            color.on(Input.EventType.TOUCH_START, this.getColor)
            color.setPosition(colorPosition.x+colorWidth*i, colorPosition.y)
            this.node.addChild(color)
        }
    }

    getColor = (event) => {
        const reqColor = event.target.getComponent(Graphics).fillColor;
        const colorPlace = this.node.parent.getChildByName("colorPlaces")
        colorPlace.on(Input.EventType.TOUCH_START, () => {
            colorPlace.getComponent(Sprite).color = reqColor
        })
    }

    
    start() {

    }

    update(deltaTime: number) {
        
    }
}

