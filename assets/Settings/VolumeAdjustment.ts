import { _decorator, Component, Node, Slider, sys, Input } from 'cc';
import { audioManager } from '../audio/scripts/audioManager';
// import { audioManager } from './audio/scripts/audioManager';
const { ccclass, property } = _decorator;

@ccclass('VolumeAdjustment')
export class VolumeAdjustment extends Component {
    @property({type: Node})
    MusicSlider: Node = null;

    @property({type: Node})
    SoundSlider: Node = null;

    @property({type: Node})
    closeButton: Node = null;

    audioInstance = audioManager.getInstance()
    onLoad(){
        this.MusicSlider!.on("slide", this.adjustMusicSound)
        this.SoundSlider!.on("slide", this.adjustSoundEffect)

        this.MusicSlider.getComponent(Slider).progress = this.audioInstance.getMusicSliderProgress()
        this.SoundSlider.getComponent(Slider).progress = this.audioInstance.getSoundSliderProgress()

        this.closeButton.on(Input.EventType.TOUCH_START, () => {
            setTimeout(() => {
                this.node.destroy()
            });
        })
    }

    adjustMusicSound = () => {
        let progress = this.MusicSlider.getComponent(Slider).progress
        sys.localStorage.setItem('MusicProgress', JSON.stringify(progress))
        this.audioInstance.adjustMusicSound(progress)
    }

    adjustSoundEffect = () => {
        let progress = this.SoundSlider.getComponent(Slider).progress
        sys.localStorage.setItem('SoundProgress', JSON.stringify(progress))
        this.audioInstance.adjustSoundEffectSound(progress)
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

