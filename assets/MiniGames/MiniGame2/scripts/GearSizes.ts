import { _decorator, Component, Node, Prefab, instantiate, UITransform, Vec3, Size, randomRangeInt, Sprite, random, JsonAsset, Label, Input, tween, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MiniGame2')
export class MiniGame2 extends Component {
    @property({type: Prefab})
    gears: Prefab = null;

    @property({type: JsonAsset})
    GearSize: JsonAsset = null;

    @property({type: Prefab})
    gearImage: Prefab = null;

    // @property({type: JsonAsset})
    // levels: JsonAsset = null;

    @property({type: Node})
    transparentGears: Node = null;

    @property({type: Node})
    NormalGears: Node = null;

    startPos:Vec3
    newGear;
    totalCount = 0;
    checkCount = 0;
    taskCompleted: Boolean = false;
    onLoad(){
        this.node.parent.getChildByName("taskCompleted").active = false;
        this.setGearSizes();
    }

    /**
     * This function is used for setting gears of different sizes which can be dragged and can be put in correct place
     */
    setGearSizes = () => {
        this.GearSize.json.forEach((element, index) => {
            const gear = instantiate(this.gears);

            // Touch Event on gears
            gear.on(Input.EventType.TOUCH_START, this.createImage)
            gear.on(Input.EventType.TOUCH_MOVE, this.drag)
            gear.on(Input.EventType.TOUCH_CANCEL, this.checkPosition)

            const gearHeight = gear.getComponent(UITransform).height + 10;
            const pos = gear.getPosition();
            gear.setPosition(new Vec3(pos.x, pos.y - gearHeight*index))
            gear.getChildByName("Sprite").getComponent(UITransform).height = element.size.height
            gear.getChildByName("Sprite").getComponent(UITransform).width = element.size.width
            gear.getChildByName("Label").getComponent(Label).string = `${element.count}`;

            // Regular expression for fetching numbers from a string expression
            this.totalCount+= Number(element.count.replace(/\D/g, ''))
            this.node.addChild(gear);
        })
        
    }


   /**
    * 
    * @param event This is the event which is passed as touch start occurs
    */
    createImage = (event) => {
        console.log(event.target.getChildByName("Label").getComponent(Label).string);
        
        if(event.target.getChildByName("Label").getComponent(Label).string != "X 0"){
            this.newGear = instantiate(this.gearImage)
            this.startPos = event.target.getPosition();
            
            this.newGear.getComponent(UITransform).height = event.target.getChildByName("Sprite").getComponent(UITransform).height
            this.newGear.getComponent(UITransform).width = event.target.getChildByName("Sprite").getComponent(UITransform).width

            this.newGear.setPosition(this.startPos);
            this.node.addChild(this.newGear);
            
        }else{
            this.newGear = null;
        }
    }

    /**
     * 
     * @param event This is the event which is passed as touch move occurs
     */
    drag = (event) => {
        if(this.newGear){
            this.newGear.setWorldPosition(event.getUILocation().x, event.getUILocation().y, 0)
        }
    }

    
    /**
     * This is the function which is executed when item is placed at invalid place
     */
    dragToStart = () => {
        tween(this.newGear)
            .to(0.95, {position: new Vec3(this.startPos.x, this.startPos.y, this.startPos.z)})
            .call(() => {
                setTimeout(() => {
                    this.newGear.destroy();
                });
            }).start()
    }


    rotateSprites = () => {
        this.NormalGears.children.forEach((element) => {
            tween(element).by(2, {angle: -360}).repeatForever().start()
        })
        this.transparentGears.children.forEach((element) => {
            tween(element).by(2, {angle: -360}).repeatForever().start()
        })
    }

    /**
     * 
     * @param event is the event which is passed as touch cancel occurs
     */
    checkPosition = (event) => {
        let flag = true;
        if(this.newGear){
            this.transparentGears.children.forEach((element) => {
                if(flag){
                    const elementPosition = element.getWorldPosition();
                    const targetPosition = event.getUILocation();
                    
                    const targetHeight = this.newGear.getComponent(UITransform).height
                    const targetWidth = this.newGear.getComponent(UITransform).width

                    
                    const elementBoundingBox = element.getComponent(UITransform).getBoundingBoxToWorld()

                    // When item is placed at valid position
                    if(elementBoundingBox.contains(targetPosition)){
                        if(targetHeight == element.getComponent(UITransform).height && targetWidth == element.getComponent(UITransform).width){
                            
                            this.node.parent.getChildByName("taskCompleted").active = true;

                            this.newGear.setWorldPosition(new Vec3(elementPosition.x, elementPosition.y, elementPosition.z))
                            
                            let currentCount = event.target.getChildByName("Label").getComponent(Label).string.replace(/\D/g, '')
                            event.target.getChildByName("Label").getComponent(Label).string = `X ${Number(currentCount)-1}`;
                            flag = false;
                            this.checkCount++;
                            if(this.checkCount == this.totalCount && !this.taskCompleted){
                                this.rotateSprites();
                                this.node.parent.getChildByName("taskCompleted").active = true;
                                this.taskCompleted = true
                            }
                            
                            // Making correct mark disappear after 1 second if an item is placed at correct position
                            if(!this.taskCompleted){
                                setTimeout(() => {
                                    this.node.parent.getChildByName("taskCompleted").active = false;
                                }, 1000);
                            }
                        }
                        // When an item is placed at invalid position
                        else{
                            this.dragToStart()
                            flag = false;
                        }
                    }
                }
            })
            if(flag){
                this.dragToStart();
            }

            
        }
    }
    

    start() {

        // if(this.check(elementPosition, targetPosition)){
        //     if(targetHeight == element.getComponent(UITransform).height && targetWidth == element.getComponent(UITransform).width){
        //         console.log("Completed");
        //         this.newGear.setWorldPosition(new Vec3(targetPosition.x, targetPosition.y))
        //         flag = false;
        //     }else{
        //         this.newGear.setWorldPosition(this.startPos)
        //         flag = false;
        //     }
        // }

        // check = (elementPosition, targetPosition) => {
    //     if((Math.floor(elementPosition.x) == Math.floor(targetPosition.x)  || Math.floor(elementPosition.x) + 1 == Math.floor(targetPosition.x)) && (Math.floor(elementPosition.y) == Math.floor(targetPosition.y)  || Math.floor(elementPosition.y) + 1 == Math.floor(targetPosition.x) )){
    //         return true;
    //     }
        
    //     else if((Math.floor(elementPosition.x) == Math.floor(targetPosition.x)  || Math.floor(elementPosition.x) == Math.floor(targetPosition.x) + 1) && (Math.floor(elementPosition.y) == Math.floor(targetPosition.y)  || Math.floor(elementPosition.y) == Math.floor(targetPosition.x) + 1 )){
    //         return true;
    //     }

    //     else if((Math.floor(elementPosition.x) == Math.floor(targetPosition.x)  || Math.floor(elementPosition.x) == Math.floor(targetPosition.x) - 1) && (Math.floor(elementPosition.y) == Math.floor(targetPosition.y)  || Math.floor(elementPosition.y) == Math.floor(targetPosition.x) - 1 )){
    //         return true
    //     }
    //     return false;
    // }
                
    }

    update(deltaTime: number) {
        
    }
}

