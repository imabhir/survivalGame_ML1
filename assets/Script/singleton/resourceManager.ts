import { _decorator, Component, Node, resources, AudioClip, Prefab, instantiate, director, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('resourceManager')
export class resourceManager {
    musicClips = [];
    PrefabArr = [];
    Sprites = [];
    // MainObj =[];
    
    public loadPercentage: number = 0;
    public totalItems: number = 0;
    public loadingMessage: string = "";
    public progressbarnode:Node;

   
    private static _instance: resourceManager = null;

    /**
     * 
     * @returns Instance of the singleton class
     */
    public static getInstance(){
        if(!resourceManager._instance){
            resourceManager._instance = new resourceManager()
        }
        return resourceManager._instance
    }

    

    loadPrefabs = async () => {
        return await new Promise((resolve, reject) => {
            resources.loadDir("prefabs", (finishedprefab, totalprefab) => {
                // on progress
                
                this.loadingMessage = "Loading Prefabs..."
                this.loadPercentage = finishedprefab;
                this.totalItems = totalprefab;
                this.progressbarnode.getComponent(ProgressBar).progress=finishedprefab/totalprefab;
                console.log("Progess value",this.progressbarnode.getComponent(ProgressBar).progress)

                
                // if("prefabs" in this.MainObj){
                //     console.log("Yes");
                // }else{
                //     this.MainObj["prefabs"] = totalprefab
                // }
                // if(!this.MainObj['prefabs']){
                //     let aa={prefabs:totalprefab}
                //     this.MainObj.push(aa);
                //     console.log(this.MainObj['prefabs']);
                    
                // }
                // console.log("LoadBLIA % : " + (this.loadPercentage / this.totalItems) * 100);

                
                // console.log("this is", percentage);
                // if(percentage == 100 && this.flag){
                //     this.flag = false;
                //     console.log("Change Scene To Login");
                //     director.loadScene("Login");
                // }
        
            },
                (error, Prefabs) => {
                    //on complete
                    if(!error){
                        this.PrefabArr = Prefabs;
                        resolve(Prefabs)
                        // console.log(`LoadBLIA Completed! ${(this.loadPercentage / this.totalItems) * 100}`, this.musicClips);
                    }else{
                        reject(error)
                    }
                });
        })
    }

    

    loadMusic = async () => {
        // return await new Promise((resolve, reject) => {
        //     resources.loadDir("audioClips", (err, musicClips) => {
        //         if(!err){
        //             this.musicClips = musicClips
        //             resolve(musicClips)
        //         }else{
        //             reject(err)
        //         }
        //     })
        // })
        return await new Promise((resolve, reject) => {
            resources.loadDir("audioClips", (finishedclip, totalclip) => {
                //on progress
                this.loadingMessage = "Loading Music Clips..."
                this.loadPercentage = finishedclip;
                this.totalItems = totalclip;
                // if("audios" in this.MainObj){
                //     console.log("Yes");
                // }else{
                //     this.MainObj["audios"] = totalclip
                // }
                // if(!this.MainObj['audios']){
                //     this.MainObj["audios"] = totalclip;
                // }
                // console.log("LoadBLIA % : " + (this.loadPercentage / this.totalItems) * 100);

                let percentage = (this.loadPercentage / this.totalItems) * 100;
            },
                (error, audios) => {
                    //on complete
                    if(!error){
                        this.musicClips = audios;
                        resolve(audios)
                        // console.log(`LoadBLIA Completed! ${(this.loadPercentage / this.totalItems) * 100}`, this.musicClips);
                    }else{
                        reject(error)
                    }
                });
        })
        
    }

    

    public getMusicFile(name: string): AudioClip {
        if (this.musicClips) {
            let clip = this.musicClips.find((clip) => clip.name === name);
            return clip || null;
        }
    }

    // public GetTotalItems(){
    //     console.log(this.MainObj);

    //     console.log("this is objjjjjjjjj", this.MainObj[0]);
    //     for(const key in this.MainObj){
    //         console.log("key: " + key);
    //         if (this.MainObj.hasOwnProperty(key)){
    //             console.log("val: " + this.MainObj[key]);
    //             this.TotalCount+= this.MainObj[key]
    //         }
    //     }
        
    // }
    

    public GetPrefab(name: string): Prefab{
        let prefab = this.PrefabArr.find((prefab) => prefab.name == name)
        return prefab
    }
}



