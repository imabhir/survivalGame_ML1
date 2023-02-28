import { _decorator, Component, Node, Prefab, instantiate, PageView, Input, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('avatarSelection')
export class avatarSelection extends Component {
    @property({type: Prefab})
    avatar: Prefab = null;

    @property({type:PageView})
    pageView: PageView = null;

    names = ["Jack","Tim","John","Cook"]

    onLoad(){
        this.addAvatar();
    }

    addAvatar = () => {
        for(let i=0;i<4;i++){
            const avatar = instantiate(this.avatar);
            this.pageView.content.addChild(avatar);
            avatar.getChildByName("Name").getComponent(Label).string = this.names[i]
            
        }
    }

    changeAvatarForward(){
        let currentIndex = this.pageView.getCurrentPageIndex();
        this.pageView.setCurrentPageIndex(currentIndex+1)
    }

    changeAvatarBackWard(){
        let currentIndex = this.pageView.getCurrentPageIndex();
        console.log(currentIndex);
        if(currentIndex == 0){
            // this.pageView.bo = 2;
        }
        this.pageView.setCurrentPageIndex(currentIndex-1)
        
    }


    start() {

    }

    update(deltaTime: number) {
        
    }
}

