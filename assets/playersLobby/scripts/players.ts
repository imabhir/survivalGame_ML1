import { _decorator, Component, Node, Prefab, JsonAsset, instantiate, UITransform, director, Input, Sprite, NodePool, log } from 'cc';
// import { gameData } from '../../gameData';
import { modes } from '../../Modes/scripts/modes';
import { photonmanager } from '../../Script/photon/photonmanager';
import { gameData } from '../../singleton/gameData';
const { ccclass, property } = _decorator;

@ccclass('playerslobby')
export class playerslobby extends Component {
    @property({ type: Prefab })
    players: Prefab = null;
    @property({ type: Prefab })
    player: Prefab = null;
    @property({ type: Prefab })
    map: Prefab = null;

    @property({ type: JsonAsset })
    playerCountInfo: JsonAsset = null;

    @property({ type: Node })
    selectMapButton: Node = null;

    @property({ type: Node })
    MostVotedMap: Node = null;


    gameDataInstance;
    photon: any;




    targetMapNode;
    start() {
        this.photon.player_lobbys = this;
    }
    onLoad() {
        this.gameDataInstance = gameData.getInstance();
        this.instantiatePlayers();
        this.selectMapButton.on(Input.EventType.TOUCH_START, this.SelectMap)


        console.log("Target Map Node", this.targetMapNode);


        this.photon = photonmanager.getInstance().photon_instance;
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
            if (element.index == modeIndex) {
                noOfPlayers = element.noOfPlayers
            }
        })
        let count = 0;
        let flag = true
        let row = 0;
        for (let i = 0; i < noOfPlayers; i++) {
            const player = instantiate(this.players)
            player.name = i.toString();
            const playerWidth = player.getComponent(UITransform).width + 20
            const playerHeight = player.getComponent(UITransform).height + 20
            const backgroundWidth = player.getComponent(UITransform).width
            const position = player.getPosition();

            if (position.x + playerWidth * count >= backgroundWidth + playerWidth) {
                row++;
                count = 0;
                player.setPosition(position.x + playerWidth * count, position.y - playerHeight * row)
                flag = false;
                count++;
            } else {
                if (!flag) {
                    player.setPosition(position.x + playerWidth * count, position.y - playerHeight * row)
                } else {
                    player.setPosition(position.x + playerWidth * count, position.y)
                }
                count++;
            }
            this.node.addChild(player)
        }
    }








    addplayerinlobby() {
        let actorcount = this.photon.myRoomActorCount();
        var actors = Object.keys(this.photon.myRoomActors()).map(key => {
            return this.photon.myRoomActors()[key];
        })

        let place = 0;
        actors.forEach((actor) => {
            console.log(this.node.getChildByName((actorcount - 1).toString()).children.length);

            if (this.node.getChildByName(place.toString()).children.length == 0) {
                console.log(this.player);

                const player = instantiate(this.player)
                player.name = actor.actorNr.toString()
                this.node.getChildByName(place.toString()).addChild(player);
                console.log(player);
            }









            place++;

        })

    }
    leaveplayerinlobby(a) {
        const player = instantiate(this.player)
        let actorcount = this.photon.myRoomActorCount();
        var actors = Object.keys(this.photon.myRoomActors()).map(key => {
            return this.photon.myRoomActors()[key];
        })
        let destroy = new NodePool;
        for (let i = 0; i < 6; i++) {
            if (i < 5)
                if (this.node.getChildByName(i.toString()).children.length != 0 && i < 5) {
                    console.log(a.actorNr);
                    destroy.put(
                        this.node.getChildByName(i.toString()).children[0]);
                }
            if (i == 5) {

                this.addplayerinlobby();
            }
        }














    }

    /**
     * 
     * @param event It is the touch event. It is used to display a list of available maps on the screen on click of a button
     */
    SelectMap = (event) => {
        let map = instantiate(this.map)
        this.node.parent.addChild(map);
        // director.loadScene("map")
    }

    showMapWithMaxVotes = (targetMapNode: Node) => {
        // console.log("Entered");
        // console.log(targetMapNode);



        let TargetMapNodeSpriteFrame = targetMapNode.getComponent(Sprite).spriteFrame
        this.MostVotedMap.getComponent(Sprite).spriteFrame = TargetMapNodeSpriteFrame

    }
    StartGame() {
        if (!photonmanager.getInstance().gamestarted)
            director.loadScene("gameplay", () => {
                photonmanager.getInstance().photon.myRoom().isOpen = false; console.log(photonmanager.getInstance().photon.myRoom().isOpen); photonmanager.getInstance().photon.joined = true; photonmanager.getInstance().gamestarted = true; photonmanager.getInstance().photon.raiseEvent(100, {}, {});
            })

    }



    update(deltaTime: number) {
        this.targetMapNode = this.gameDataInstance.getMapWithMaxVotes();
        if (this.targetMapNode != null) {

            this.showMapWithMaxVotes(this.targetMapNode)
        }
    }
}

