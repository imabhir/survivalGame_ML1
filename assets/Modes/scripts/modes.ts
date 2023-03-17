import { _decorator, Component, Node, PageView, Input, SpriteFrame, Sprite, UIOpacity, Vec3, Prefab, instantiate, UITransform, Label,JsonAsset, director, tween } from 'cc';
import { audioManager } from '../../audio/scripts/audioManager';
import { gameData } from '../../gameData';
import { players } from '../../playersLobby/scripts/players';
import { resourceManager } from '../../resourceManager';
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

    @property({type: Node})
    text: Node = null;

    @property({type: Node})
    loadingIcon: Node = null;

    @property({type: Node})
    rotater: Node = null;


    // It is used to store the modeInformation which is used to check which mode we are entering in
    modeIndex;
    gameDataInstance = gameData.getInstance()
    resourceInstance = resourceManager.getInstance();
    audioInstance = audioManager.getInstance();
    onLoad(){
        this.loadingIcon.active = false;
        this.rotater.active = false;
        this.text.active = true;
        this.applyMusic();
        this.node.getComponent(PageView).content.children.forEach((element) => {
            this.addOverlay(element)
        })   
    }

    applyMusic = () => {
        this.scheduleOnce(() => {
            this.resourceInstance.loadMusicPrefab();
            const music = instantiate(this.resourceInstance.getMusicPrefab("Music"))
            this.node.addChild(music)
        }, 1)
        
        this.resourceInstance.loadMusic();
        this.scheduleOnce(()=>{
            const clip = this.resourceInstance.getMusicFile("audio1") 
            this.audioInstance.playMusicClip(clip, true)
        }, 1)
    }
    

    /**
     * 
     * @param element It represents every page of page view
     * This function adds an overlay in front of the clicked mode
     */
    addOverlay = (element) => {
        element.on(Input.EventType.TOUCH_START, () => {
            const overlay = instantiate(this.overlay)
            
            overlay.getComponent(UITransform).height = element.getComponent(UITransform).height
            overlay.getComponent(UITransform).width = element.getComponent(UITransform).width
            overlay.setPosition(0,0)
        
            overlay.getChildByName("InstructionButton").on(Input.EventType.TOUCH_START, this.showInstructions)
            overlay.getChildByName("SelectButton").on(Input.EventType.TOUCH_START, this.enterMode)
            overlay.getChildByName("close").on(Input.EventType.TOUCH_START, this.closeOverlay)
            overlay.getComponent(UIOpacity).opacity = 150
            element.addChild(overlay)
        })
    }

    /**
     * 
     * @param event It is touch start event on select button
     * This function is used for loading the specific mode i.e. Primary, Secondary or Tertiary
     */

    enterMode = (event) => {
        this.loadingIcon.active = true;
        this.rotater.active = true;
        this.modeIndex = event.target.parent.parent.getComponent(ModeEnum).ModeName;
        tween(this.rotater).by(2, {angle: -360}).repeatForever().start()
        this.audioInstance.stopMusic()
        setTimeout(() => {
            director.loadScene("playersLobby")
        }, 3000);
        
        this.gameDataInstance.initMode(this.modeIndex)
    }

    /**
     * 
     * @param event It is touch start event
     * This function is used to destroy the overlay on click of cross button
     */

    closeOverlay = (event) => {
        setTimeout(() => {
            event.target.parent.destroy()
        });
    }

    /**
     * 
     * @param index It represents index of the mode. For primary 1, secondary 2 and tertiary 3.
     * @returns The string which represents rules corresponding to every mode.
     */
    
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

    /**
     * 
     * @param event It is touch start event
     * This function shows the instruction corresponding to every mode
     */

    showInstructions = (event) => {
        this.text.active = false;
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

    /**
     * 
     * @param event It is touch start event
     * This function closes the instruction on click of cross button
     */

    closeInstructions = (event) => {
        this.text.active = true
        setTimeout(() => {
            event.target.parent.destroy()
        });
    }
    

    start() {
        
    }

    update(deltaTime: number) {
        
    }
}

