import { _decorator, Component, Node, resources, AudioClip, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('resourceManager')
export class resourceManager {
    musicClips = []
    musicPrefabArr = [];
    private static _instance:resourceManager = null;

    public static getInstance(){
        if(!resourceManager._instance){
            resourceManager._instance = new resourceManager()
        }
        return resourceManager._instance
    }

    loadMusicPrefab = () => {
        resources.loadDir("prefabs", (err, musicPrefabArr) => {
            return new Promise((resolve, reject) => {
                if(!err){
                    this.musicPrefabArr = musicPrefabArr
                    resolve(musicPrefabArr)
                }else{
                    reject(err)
                }
            })
        })
    }

    public getMusicPrefab(name: string): Prefab{
        let musicPrefab = this.musicPrefabArr[0]
        return musicPrefab;
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
        if (this.musicClips) {
            let clip = this.musicClips.find((clip) => clip.name == name);
            return clip || null;
        }
    }
}



