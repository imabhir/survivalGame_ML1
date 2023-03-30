import { _decorator, Component, Node, resources, AudioClip, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('resourceManager')
export class resourceManager {
    musicClips = [];
    PrefabArr = [];
    Sprites = []
    
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

    /**
     * Loading prefab folder in which all prefabs reside
     */
    loadPrefabs = () => {
        resources.loadDir("prefabs", (err, PrefabArr) => {
            return new Promise((resolve, reject) => {
                if(!err){
                    this.PrefabArr = PrefabArr
                    resolve(PrefabArr)
                }else{
                    reject(err)
                }
            })
            
        })
    }

    /**
     * Loading audioClips folder in which all music clips reside
     */
    loadMusic = () => {
        resources.loadDir("audioClips", (err, musicClips) => {
            return new Promise((resolve, reject) => {
                if(!err){
                    this.musicClips = musicClips;
                    resolve(musicClips)
                }else{
                    reject(err)
                }
            })
            
        })
    }

    public getMusicPrefab(name: string): Prefab{
        let musicPrefab = this.PrefabArr.find((prefab) => prefab.name == name)
        return musicPrefab;
    }

    public getSettingsPrefab(name: string): Prefab{
        let settingsPrefab = this.PrefabArr.find((prefab) => prefab.name == name)
        return settingsPrefab;
    }

    public getSettingsControlsPrefab(name: string): Prefab{
        let settingsControls = this.PrefabArr.find((prefab) => prefab.name == name)
        return settingsControls;
    }

    public getMusicFile(name: string): AudioClip {
        if (this.musicClips) {
            let clip = this.musicClips.find((clip) => clip.name == name);
            return clip || null;
        }
    }

    public getAccountPrefab(name: string): Prefab{
        let accountPrefab = this.PrefabArr.find((prefab) => prefab.name == name)
        return accountPrefab;
    }

    public getAccountControlsPrefab(name: string): Prefab{
        let accountControlsPrefab = this.PrefabArr.find((prefab) => prefab.name == name)
        return accountControlsPrefab;
    }

    public getPopUp(name: string): Prefab{
        let popUp = this.PrefabArr.find((prefab) => prefab.name == name)
        return popUp;
    }
}



