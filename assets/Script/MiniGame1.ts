import { _decorator, Component, Node, Input, UITransform, Prefab, JsonAsset, instantiate, Vec3, randomRange, random, randomRangeInt } from 'cc';
import { itemDataType, ITEM_TYPE, levelItem } from './levelItem';
const { ccclass, property } = _decorator;

@ccclass('MiniGame1')
export class MiniGame1 extends Component {
    @property({type: Prefab})
    thunder: Prefab = null;

    @property({type: Prefab})
    bulb: Prefab = null;

    @property({type: Prefab})
    stick: Prefab = null;

    @property({type: JsonAsset})
    positions: JsonAsset = null;

    @property({type: JsonAsset})
    get levelData(){
     return this.positions
    }
    set levelData(value){
        this.positions = value;
        this.node.destroyAllChildren()
        // this.updateLevel(this.positions.json)
    }

    
    notFixed = 0;
    onLoad(){
        this.node.parent.getChildByName("completed").active = false;
        this.updateLevel(this.positions.json)
        // this.node.addChild(this.thunder);
        // this.thunder.setPosition(this.positions.json[0].obj.x, this.positions.json[0].obj.y)
        // this.thunder.angle = this.positions.json[0].angle;
        // this.node.parent.getChildByName("completed").active = false;
        // this.sticks();
    }

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
    len = 0;
    updateLevel = (itemsInfo:itemDataType[]) => {
        // let itemsInfo:itemDataType[] = [];
        // itemsInfo = this.positions.json
        console.log(itemsInfo);

        itemsInfo.forEach(element => {
            if(!element.isFixed){
                this.notFixed++;
            }
        })
        

        /**
         * Iterating the json file and checking each asset's types and creating the instance according to the type
         */
        itemsInfo.forEach(element => {
            let item:Node=null;
            switch(element.itemType){
                case ITEM_TYPE.BEGIN:{
                    console.log("Thunder");
                    
                    item = instantiate(this.thunder);
                }break;
                case ITEM_TYPE.END:{
                    console.log("Bulb");
                    
                    item = instantiate(this.bulb);
                }break;
                case ITEM_TYPE.L_SHAPED:{
                    console.log("stickL");
                    item = instantiate(this.stick);
                    
                }break;
                case ITEM_TYPE.STRAIGHT:{
                    console.log("stickS");
                    item = instantiate(this.stick);
                    
                }break;
            }
            // Setting the properties
            if(item){
                // console.log("Item Added");
                
                // console.log(element);
                
                item.setPosition(new Vec3(element.obj.x,element.obj.y,element.obj.z));
                // item.setPosition(Vec3.ZERO);
                item.getComponent(levelItem).resultantAngle = element.angle;
                // console.log(item.getComponent(levelItem).resultantAngle);
                
                item.getComponent(levelItem).isFixed = element.isFixed;
                if(!element.isFixed){
                    item.angle = randomRangeInt(0,2)*90;
                    if(item.angle == item.getComponent(levelItem).resultantAngle){
                        this.len++;
                    }
                    if(this.len == this.notFixed){
                        console.log("Completed");
                    }
                    
                    // Touch event on items which are not fixed
                    item.on(Input.EventType.TOUCH_START, this.checkPos)
                }else{
                    item.angle = element.angle;
                }
                this.node.addChild(item);
            }
        });
        
    }
    
    checkPos = (event) => {
        if(event.target.angle == 0){
            event.target.angle = 90;
        }else{
            event.target.angle = 0;
        }

        if(event.target.angle == event.target.getComponent(levelItem).resultantAngle){
            this.len++;
            if(this.len == this.notFixed){
                console.log("Completed");
                this.node.parent.getChildByName("completed").active = true;
            }
        }
    }


    start() {
        
    }

    update(deltaTime: number) {
        
    }
}

