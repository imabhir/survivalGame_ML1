import { _decorator, Component, Node, Slider, sys, Input, Button } from "cc";
import { audioManager } from "../audio/scripts/audioManager";
// import { audioManager } from './audio/scripts/audioManager';
const { ccclass, property } = _decorator;

@ccclass("VolumeAdjustment")
export class VolumeAdjustment extends Component {
  @property({ type: Node })
  MusicSlider: Node = null;
  @property({ type: Node })
  settingPanel: Node = null;
  @property({ type: Node })
  SoundSlider: Node = null;

  @property({ type: Button })
  closeButton: Button = null;

  audioInstance = audioManager.getInstance();
  onLoad() {
    console.log("Setting Panel loaded");
    this.MusicSlider!.on("slide", this.adjustMusicSound);
    this.SoundSlider!.on("slide", this.adjustSoundEffect);

    this.MusicSlider.getComponent(Slider).progress = this.audioInstance.getMusicSliderProgress();
    this.SoundSlider.getComponent(Slider).progress = this.audioInstance.getSoundSliderProgress();

    // this.closeButton.on(Input.EventType.TOUCH_START, () => {
    //     setTimeout(() => {
    //         this.node.destroy()
    //     });
    // })
  }

  adjustMusicSound = () => {
    let progress = this.MusicSlider.getComponent(Slider).progress;
    sys.localStorage.setItem("MusicProgress", JSON.stringify(progress));
    this.audioInstance.adjustMusicSound(progress);
  };

  adjustSoundEffect = () => {
    let progress = this.SoundSlider.getComponent(Slider).progress;
    sys.localStorage.setItem("SoundProgress", JSON.stringify(progress));
    this.audioInstance.adjustSoundEffectSound(progress);
  };
  displaySettingPanel() {
    console.log("Active setting panel");
    this.settingPanel.active = true;
  }
  hideSettingPanel() {
    this.settingPanel.active = false;
  }
  start() {
    console.log("Volumn Adjustment start called");
  }

  update(deltaTime: number) {}
}
