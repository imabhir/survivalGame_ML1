import { _decorator, Component, Node, Prefab, instantiate, Graphics, UITransform, Input, Sprite, Color } from "cc";
// import { type } from 'os';
const { ccclass, property } = _decorator;

@ccclass("ColorPallete")
export class ColorPallete extends Component {
    @property({ type: Prefab })
    color: Prefab = null;

    // Sample color codes for creating color pallete
    colorCodes = ["#FF0000", "#0FF00", "#0000FF", "#FFFF00", "#FFA500", "#800080", "#FFC0CB", "#808080"];
    index = 0;

    // Initial color of transparent squares
    pickedColor = null;
    onLoad() {
        this.colorPallete();
        this.colorCodes = this.shuffleArray(this.colorCodes);
    }
    shuffleArray(array: any[]): any[] {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    }

    /**
     * This function is used for creating color pallete from which the colors are to be picked
     */
    colorPallete = () => {
        for (let i = 0; i < this.colorCodes.length; i++) {
            const color = instantiate(this.color);
            const colorPosition = color.getPosition();
            const parentHeight = this.node.getComponent(UITransform).height;
            const colorWidth = color.getComponent(UITransform).width + 20;
            const colorGraphics = color.getComponent(Graphics);
            colorGraphics.circle(0, 0, parentHeight / 3);
            colorGraphics.fillColor.fromHEX(this.colorCodes[this.index++]);
            colorGraphics.fill();

            color.on(Input.EventType.TOUCH_START, this.pickColor);
            color.setPosition(colorPosition.x + colorWidth * i, colorPosition.y);
            this.node.addChild(color);
        }
    };

    /**
     *
     * @param event Touch event for picking the required color
     * This function stores the picked color in pickedColor variable
     */
    pickColor = (event) => {
        this.pickedColor = event.target.getComponent(Graphics).fillColor;
    };

    start() {}

    update(deltaTime: number) {}
}
