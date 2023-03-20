import { _decorator, Component, Node, AudioSource, AudioClip, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('audioManager')
export class audioManager {
    private static _instance: audioManager = null;
    private _audioSource: AudioSource = null;
    private _SoundEffectAudioSource: AudioSource = null;
    private MusicSliderProgress = 0
    private SoundSliderProgress = 0

    private canPlayMusic = true;
    private canPlaySound = true;

    public static getInstance(){
        if(!audioManager._instance){
            audioManager._instance = new audioManager()
        }
        return audioManager._instance
    }

    init(audioSource: AudioSource){
        this._audioSource = audioSource
    }

    initSoundEffectAS(audioSource: AudioSource) {
        this._SoundEffectAudioSource = audioSource;
    }

    // playMusic(loop: boolean){
    //     if (!this.canPlayMusic) {
    //         return;
    //     }
    //     this._audioSource.loop = loop
    //     if(!this._audioSource.playing){
    //         this._audioSource.play();
    //     }
        
    // }

    playMusicClip(clip: AudioClip, loop: boolean) {
        if (!this.canPlayMusic) {
            return;
        }
        if (clip) {
            this.stopMusic();
            this._audioSource.clip = clip;
            this._audioSource.loop = loop;
            this._audioSource.play();
        } else {
            console.log(clip, "Invalid audio clip format");
        }
    }

    stopMusic() {
        this._audioSource.stop();
    }

    playSoundEffect(clip: AudioClip, loop: boolean = false) {
        if (!this.canPlaySound) {
            return;
        }
        if (clip) {
            this.stopSoundEffect();
            this._SoundEffectAudioSource.clip = clip;
            this._SoundEffectAudioSource.loop = loop;
            this._SoundEffectAudioSource.play();
        } else {
            console.log(clip, "Invalid audio clip format");
        }
    }

    stopSoundEffect() {
        this._SoundEffectAudioSource.stop();
    }

    adjustMusicSound(progress){
        this.MusicSliderProgress = progress
        this._audioSource.volume = progress
    }

    getMusicSliderProgress(){
        return this.MusicSliderProgress
    }

    getSoundSliderProgress(){
        return this.SoundSliderProgress
    }

    adjustSoundEffectSound(progress){
        this.SoundSliderProgress = progress
        this._SoundEffectAudioSource.volume = progress
    }
}

