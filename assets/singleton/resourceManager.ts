import { _decorator, Component, Node, resources, AudioClip, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('resourceManager')
export class resourceManager {
    musicClips = [];
    PrefabArr = [];
    Sprites = []
    // LoadResourcesPercentage = [];
    cnt = 0;
    private static _instance: resourceManager = null;

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

    loadAvatarSprites = () => {
        resources.loadDir("avatarSceneSprites", (err, avatarSceneSprites) => {
            return new Promise((resolve, reject) => {
                if(!err){
                    resolve(avatarSceneSprites)
                }else{
                    reject(err)
                }
            })
            
        })
    }

    // loadModeSprites = () => {
    //     resources.loadDir("ModesSprites", (err, ModesSprites) => {
    //         return new Promise((resolve, reject) => {
    //             if(!err){
    //                 resolve(ModesSprites)
    //             }else{
    //                 reject(err)
    //             }
    //         })
            
    //     })
    // }

    // loadPlayersLobbySprites = () => {
    //     resources.loadDir("playersLobbySprites", (err, playersLobbySprites) => {
    //         return new Promise((resolve, reject) => {
    //             if(!err){
    //                 resolve(playersLobbySprites)
    //             }else{
    //                 reject(err)
    //             }
    //         })
            
    //     })
    // }

    public getSettingsPrefab(name: string): Prefab{
        let settingsPrefab = this.PrefabArr.find((prefab) => prefab.name == name)
        return settingsPrefab;
    }

    public getMusicPrefab(name: string): Prefab{
        let musicPrefab = this.PrefabArr.find((prefab) => prefab.name == name)
        return musicPrefab;
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
}



