import { _decorator, Component, Node, tween, director, ProgressBar, Label } from 'cc';
import { resourceManager } from '../singleton/resourceManager';
const { ccclass, property } = _decorator;

@ccclass('load')
export class login extends Component {
    @property(ProgressBar)
    Progressbar: ProgressBar = null;

    @property(Label)
    loadMessage: Label = null;

    resourceInstance ;
    flag = true;
    
    onLoad() {
       this.resourceInstance = resourceManager.getInstance()
       this.resourceInstance.progressbarnode=this.Progressbar;
    }

    start() {
        setTimeout(() => {
            this.resourceInstance.loadMusic().then((audios) => {
                console.log("Music Loaded", audios);
            })

            this.resourceInstance.loadPrefabs().then((prefabs) => {
                console.log("Prefabs Loaded", prefabs); 
            })
            
            console.log("Scene Loaded");

        }, 2000);
    }

    update(deltaTime: number) {
        // let percentage = (this.resourceInstance.loadPercentage / this.resourceInstance.totalItems) * 100;
        // console.log("this is", percentage);
        // if(percentage == 100 && this.flag){
        //     this.flag = false;
        //     console.log("Change Scene To Login");
            
        //     director.loadScene("Login")
        // }
        
        
        // this.loadMessage.string = this.resourceInstance.loadingMessage;
        // this.Progressbar.getComponent(ProgressBar).progress = percentage / 100;
        
    }
}

