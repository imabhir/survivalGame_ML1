import { _decorator, Component, Node, PageView, Input, SpriteFrame, Sprite, UIOpacity, Vec3, Prefab, instantiate, UITransform, Label,JsonAsset, director, tween, Toggle } from 'cc';
import { audioManager } from '../../audio/scripts/audioManager';
// import { gameData } from '../../gameData';
import { players } from '../../playersLobby/scripts/players';
import { gameData } from '../../singleton/gameData';
import { resourceManager } from '../../singleton/resourceManager';
// import { resourceManager } from '../../resourceManager';
import { ModeEnum, MODE_NAME } from './ModeEnum';
const { ccclass, property } = _decorator;

@ccclass('modes')
export class modes extends Component {
    @property({type: Prefab})
    Buttons: Prefab = null;

    @property({type: Prefab})
    Toggle: Prefab = null;

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

    @property({type: Node})
    arrowButtonLeft: Node = null;

    @property({type: Node})
    arrowButtonRight: Node = null;

    @property({type: Prefab})
    goldenBorder: Prefab = null;

    @property({type: Node})
    EnterButton: Node = null


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
        this.resourceInstance.loadPrefabs();
        this.resourceInstance.loadMusic();

        /**
         * Left button for sliding
         */
        this.arrowButtonLeft.on(Input.EventType.TOUCH_START, () => {
            let currentIndex = this.node.getComponent(PageView).getCurrentPageIndex()
            this.node.getComponent(PageView).setCurrentPageIndex(currentIndex+1)
        })

        /**
         * Right button for sliding
         */
        this.arrowButtonRight.on(Input.EventType.TOUCH_START, () => {
            let currentIndex = this.node.getComponent(PageView).getCurrentPageIndex()
            this.node.getComponent(PageView).setCurrentPageIndex(currentIndex-1)
        })

        this.selectMode() 
    }

    /**
     * This function is used for selection of particular mode
     */

    selectMode = () => {
        this.node.getComponent(PageView).content.children.forEach((element) => {
            const buttons = instantiate(this.Buttons)
            const toggleButton = instantiate(this.Toggle)
            
            buttons.getChildByName("InstructionButton").on(Input.EventType.TOUCH_START, this.showInstructions)
            element.on(Input.EventType.TOUCH_START, (event) => {
                const Border = instantiate(this.goldenBorder)
                event.target.addChild(Border)
                toggleButton.getComponent(Toggle).isChecked = true
                this.EnterButton.on(Input.EventType.TOUCH_START, () => {
                    this.enterMode(element)
                })
            })
            element.addChild(buttons)
            element.addChild(toggleButton)
        })   
    }

    /**
     * This function is used to apply background music
     */

    applyMusic = () => {
        this.scheduleOnce(() => {
            const music = instantiate(this.resourceInstance.getMusicPrefab("Music"))
            this.node.addChild(music)
        }, 1)
        
        
        this.scheduleOnce(()=>{
            const clip = this.resourceInstance.getMusicFile("audio1") 
            this.audioInstance.playMusicClip(clip, true)
        }, 1)
    }
    

    /**
     * 
     * @param event It is touch start event on select button
     * This function is used for loading the specific mode i.e. Primary, Secondary or Tertiary
     */

    enterMode = (element) => {
        const clip = this.resourceInstance.getMusicFile("AvatarChanging")
        this.audioInstance.playSoundEffect(clip)

        this.loadingIcon.active = true;
        this.rotater.active = true;
        this.modeIndex = element.getComponent(ModeEnum).ModeName;

        console.log(this.modeIndex);
        
        tween(this.rotater).by(2, {angle: -360}).repeatForever().start()
        this.audioInstance.stopMusic()

        setTimeout(() => {
            director.loadScene("playersLobby")
        }, 3000);
        
        this.gameDataInstance.initMode(this.modeIndex)
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
        return reqString;
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

