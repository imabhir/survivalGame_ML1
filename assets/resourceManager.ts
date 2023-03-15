import { _decorator, Component, Node, resources, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('resourceManager')
export class resourceManager {
    musicClips = []
    private static _instance:resourceManager = null;

    public static getInstance(){
        if(!resourceManager._instance){
            resourceManager._instance = new resourceManager()
        }
        return resourceManager._instance
    }
    
    loadMusic = () => {
        resources.loadDir("audioClips", (err, music) => {
            return new Promise((resolve, reject) => {
                if(!err){
                    this.musicClips = music;
                    resolve(music)
                }else{
                    reject(err)
                }
            })
        })
    }

    public getMusicFile(name: string): AudioClip {
        console.log(this.musicClips);
        
        if (this.musicClips) {
            let clip = this.musicClips.find((clip) => clip.name == name);
            return clip || null;
        }
    }

}



