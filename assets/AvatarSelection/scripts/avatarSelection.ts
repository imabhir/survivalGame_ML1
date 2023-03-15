import { _decorator, Component, Node, Prefab, instantiate, PageView, Input, Label, AudioClip } from 'cc';
import { audioManager } from '../../audio/scripts/audioManager';
import { resourceManager } from '../../resourceManager';
const { ccclass, property } = _decorator;

@ccclass('avatarSelection')
export class avatarSelection extends Component {
    @property({type: Prefab})
    avatar: Prefab = null;

    @property({type:PageView})
    pageView: PageView = null;

    @property({type: Prefab})
    music: Prefab = null;

    names = ["Jack","Tim","John","Cook"]

    onLoad(){
        this.addAvatar();

        const music = instantiate(this.music)
        this.node.addChild(music);
        const resourceInstance = resourceManager.getInstance();
        const audioInstance = audioManager.getInstance();
        resourceInstance.loadMusic()
        this.scheduleOnce(()=>{
            const clip = resourceInstance.getMusicFile("audio1") 
            audioInstance.playMusicClip(clip, true)
        },1)
       
    }

    

    /**
     * This function is used for adding avatars
     */
    addAvatar = () => {
        for(let i=0;i<4;i++){
            const avatar = instantiate(this.avatar);
            this.pageView.content.addChild(avatar);
            avatar.getChildByName("Name").getComponent(Label).string = this.names[i]
        }
    }

    /**
     * This function is used for sliding the avatar forward
     */
    changeAvatarForward(){
        let currentIndex = this.pageView.getCurrentPageIndex();
        this.pageView.setCurrentPageIndex(currentIndex+1)
    }

    /**
     * This function is used for sliding the avatar backward
     */
    changeAvatarBackWard(){
        let currentIndex = this.pageView.getCurrentPageIndex();
        console.log(currentIndex);
        this.pageView.setCurrentPageIndex(currentIndex-1)
    }


    start() {

    }

    update(deltaTime: number) {
        
    }
}

