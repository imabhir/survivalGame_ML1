import { _decorator, Component, Node, PageView, Input, SpriteFrame, Sprite, UIOpacity, Vec3, Prefab, instantiate, UITransform, Label,JsonAsset } from 'cc';
import { ModeEnum, MODE_NAME } from './ModeEnum';
const { ccclass, property } = _decorator;

@ccclass('modes')
export class modes extends Component {
    @property({type: Prefab})
    overlay: Prefab = null;

    @property({type: Prefab})
    Instructions: Prefab = null;

    @property({type: JsonAsset})
    modesInfo: JsonAsset = null;

    
    onLoad(){
        this.node.getComponent(PageView).content.children.forEach((element) => {
            this.addOverlay(element)
        })
    }
    
    addOverlay = (element) => {
        element.on(Input.EventType.TOUCH_START, () => {
            const overlay = instantiate(this.overlay)
            overlay.getComponent(UITransform).height = element.getComponent(UITransform).height
            overlay.getComponent(UITransform).width = element.getComponent(UITransform).width
            overlay.setPosition(Vec3.ZERO)
            overlay.getChildByName("InstructionButton").on(Input.EventType.TOUCH_START, this.showInstructions)
            overlay.getChildByName("close").on(Input.EventType.TOUCH_START, (event) => {
                setTimeout(() => {
                    console.log("Destroy");
                    event.target.parent.destroy()
                    console.log("Destroyed");
                });
            })
            
            // console.log("get uuid ",overlay.uuid);
            
            element.addChild(overlay)
        }, true) 
    }

   
    
    check = (index) => {
        let reqString: string;
        this.modesInfo.json.forEach((element) => {
            if(element.index == index){
                if(element.canConvertSurvivorToZombies){
                    reqString = element.gameObjective
                }else{
                    reqString = element.gameObjective
                }
            }
        })
        return reqString
    }

    showInstructions = (event) => {
        // event.target.getChildByName("close").on(Input.EventType.TOUCH_START, this.closeInstructions)
        const eventTarget = event.target.parent.parent.getComponent(ModeEnum).ModeName
        const instruction = instantiate(this.Instructions)
        instruction.getChildByName("close").on(Input.EventType.TOUCH_START, this.closeInstructions)
        switch(eventTarget){
            case MODE_NAME.PRIMARY:{
                instruction.getChildByName("Label").getComponent(Label).string =  this.check(MODE_NAME.PRIMARY)
                this.node.addChild(instruction)
            }break;

            case MODE_NAME.SECONDARY:{
                instruction.getChildByName("Label").getComponent(Label).string =  this.check(MODE_NAME.SECONDARY)
                this.node.addChild(instruction)
            }break;

            case MODE_NAME.TERTIARY:{
                instruction.getChildByName("Label").getComponent(Label).string =  this.check(MODE_NAME.TERTIARY)
                this.node.addChild(instruction)
            }break;
        }
    }

    closeInstructions = (event) => {
        setTimeout(() => {
            event.target.parent.destroy()
        });
    }
    

    start() {
        this.node.getComponent(PageView).content.children.forEach((element) => {
            this.addOverlay(element)
        })
    }

    update(deltaTime: number) {
        
    }
}

