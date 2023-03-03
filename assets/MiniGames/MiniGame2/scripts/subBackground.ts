import { _decorator, Component, Node, Prefab, instantiate, UITransform, random, randomRange } from 'cc';
import { MiniGame2 } from './MiniGame2';
const { ccclass, property } = _decorator;

@ccclass('subBackground')
export class subBackground extends Component {
    @property({type: Prefab})
    gears: Prefab = null;

    @property({type: Prefab})
    transparent: Prefab = null;


    onLoad(){
        const jsonFile = this.node.parent.getComponent(MiniGame2).properties.json
        const backGroundHeight = this.node.getComponent(UITransform).height;
        const backgroundWidth = this.node.getComponent(UITransform).width;

        // for(let i=0;i<cnt;i++){

        //     const gear = instantiate(this.gears)
        //     const gearHeight = gear.getComponent(UITransform).height;
        //     const gearWidth = gear.getComponent(UITransform).width;
        //     const spriteGear = gear.getChildByName("Sprite")

        //     const randomX = randomRange((-1)*backGroundHeight/2 - (-1)*gearHeight/2, backGroundHeight/2 - gearHeight/2)
        //     const randomY = randomRange((-1)*backgroundWidth/2 - (-1)*gearWidth/2, backgroundWidth/2 - gearWidth/2)
            
        //     spriteGear.setPosition(randomX, randomY)
        //     // console.log(spriteGear.getPosition());
            
        //     this.node.addChild(spriteGear)
        // }

        
        
        jsonFile.forEach((element, index) => {
            let elementCount = element.count;
            for(let i=0;i<=elementCount;i++){
                const transparentGear = instantiate(this.transparent)
                transparentGear.getComponent(UITransform).height = element.size.height
                transparentGear.getComponent(UITransform).width = element.size.width

                // if(ind == elementCount+1){
                //     transparentGear.setPosition(startingPosX, startingPosY - element.size.height*ind)
                // }else{
                //     console.log(startingPosY - element.size.height*ind)
                //     transparentGear.setPosition(startingPosX + element.size.width*i, startingPosY - element.size.height*ind)
                // }
                let randomX = randomRange((-1)*backGroundHeight/2 - (-1)*element.size.height/2, backGroundHeight/2 - element.size.height/2)
                let randomY = randomRange((-1)*backgroundWidth/2 - (-1)*element.size.width/2, backgroundWidth/2 - element.size.width/2)
                
                transparentGear.setPosition(randomX, randomY)

                
                this.node.addChild(transparentGear)
            }
        })
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

