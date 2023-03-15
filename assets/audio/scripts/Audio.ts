import { _decorator, Component, Node, AudioSource } from 'cc';
import { audioManager } from '../../audio/scripts/audioManager';
const { ccclass, property } = _decorator;

@ccclass('Audio')
export class Audio extends Component {
    @property({type: AudioSource})
    SoundEffect: AudioSource = null;

    @property({type: AudioSource})
    MusicSound: AudioSource = null;

    onLoad(){
        let audioInstance = audioManager.getInstance();
        audioInstance.init(this.MusicSound.getComponent(AudioSource))
        audioInstance.initSoundEffectAS(this.SoundEffect.getComponent(AudioSource))
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

