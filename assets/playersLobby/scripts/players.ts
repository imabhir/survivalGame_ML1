import { _decorator, Component, Node, Prefab, JsonAsset, instantiate, UITransform, director, Input, Sprite, Button } from 'cc';
// import { gameData } from '../../gameData';
import { modes } from '../../Modes/scripts/modes';
import { gameData } from '../../singleton/gameData';
const { ccclass, property } = _decorator;

@ccclass('players')
export class players extends Component {
    @property({type: Prefab})
    players: Prefab = null;

    @property({type: JsonAsset})
    playerCountInfo: JsonAsset = null;

    @property({type: Node})
    selectMapButton: Node = null;

    @property({type: Node})
    MostVotedMap: Node = null;

    @property({type: Node})
    StartButton: Node = null;
    

    gameDataInstance;
    playerCount = 0;
    onLoad(){
        this.gameDataInstance = gameData.getInstance();
        this.instantiatePlayers();
        this.selectMapButton.on(Input.EventType.TOUCH_START, this.SelectMap)

        let targetMapNode: Node = this.gameDataInstance.getMapWithMaxVotes();
        console.log("Target Map Node", targetMapNode);
        
        if(targetMapNode != null){
            
            this.showMapWithMaxVotes(targetMapNode)
        }
    }
    /**
     * This function instantiates the players and display them on the scene
     */

    instantiatePlayers = () => {
        /**
         * This part decides the no of players according to the mode and assign it to the noOfPlayers variable
         */
        
        let modeIndex = this.gameDataInstance.getModeOnSelect()
        let noOfPlayers = 0;
        this.playerCountInfo.json.forEach((element) => {
            if(element.index == modeIndex){
                noOfPlayers = element.noOfPlayers
            }
        })
        let count = 0;
        let flag = true
        let row = 0;
        for(let i=0;i<noOfPlayers;i++){
            const player = instantiate(this.players)
            const playerWidth = player.getComponent(UITransform).width + 20
            const playerHeight = player.getComponent(UITransform).height + 20
            const backgroundWidth = player.getComponent(UITransform).width
            const position = player.getPosition();
            
            if(position.x+playerWidth*count >= backgroundWidth+playerWidth){
                row++;
                count = 0;
                player.setPosition(position.x+playerWidth*count, position.y-playerHeight*row)
                flag = false;
                count++;
            }else{
                if(!flag){
                    player.setPosition(position.x+playerWidth*count, position.y-playerHeight*row)
                }else{
                    player.setPosition(position.x+playerWidth*count, position.y)
                }
                count++;
            }
            this.node.addChild(player)
        }
    }

    /**
     * 
     * @param event It is the touch event. It is used to display a list of available maps on the screen on click of a button
     */
    SelectMap = (event) => {
        director.loadScene("map")
    }

    showMapWithMaxVotes = (targetMapNode: Node) => {
        console.log("Entered");
        // console.log(targetMapNode);
        console.log(targetMapNode.getComponent(Sprite).spriteFrame);
        let TargetMapNodeSpriteFrame = targetMapNode.getComponent(Sprite).spriteFrame
        this.MostVotedMap.getComponent(Sprite).spriteFrame = TargetMapNodeSpriteFrame
        console.log(this.MostVotedMap.getComponent(Sprite).spriteFrame);
    }


    CheckPlayerCount(){
        if(this.playerCount >= 2){
            this.StartButton.getComponent(Button).interactable = true;
        }
    }

    
    start() {
        
    }

    update(deltaTime: number) {
        
    }
}

