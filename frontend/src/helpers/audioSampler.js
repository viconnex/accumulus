import Tone from 'tone';

class AudioSampler {
  constructor(audioCtx, soundsRootUrl, outputNode, fxNode, quantize, sound) {
    this.audioCtx = audioCtx;
    this.soundsRootUrl = soundsRootUrl;
    this.quantize = quantize;

    this.fxGainNode = new Tone.Gain();
    this.masterGainNode = new Tone.Gain();

    this.masterGainNode.connect(outputNode);
    this.fxGainNode.connect(fxNode);

    this.player = null;

    this.setSample(sound);
  }

  setSample(sample) {
    let url = `${this.soundsRootUrl}/${sample}.wav`;
    console.log(url);
    this.player = new Tone.Player(url, () => console.log('sample loaded')).fan(this.masterGainNode, this.fxGainNode);
    // this.player.toMaster();
    // this.player.connect(this.masterGainNode);
    // this.player.connect(this.fxGainNode);
  }

  touchEvent(evt, x, y) {
    if (evt == 'startPlaying') {
      // console.log('click');
      this.fxGainNode.gain.value = 1 - y;

      this.player.playbackRate.value = 1.0 + x;
      if (this.quantize != 0) {
        var numQuants = this.audioCtx.currentTime * this.quantize;
        /*
        if (numQuants % 1 < 0.1)

        {
          newSource.start(0);
          console.log(numQuants % 1);
        }
        else
        */
        {
          var playTime = (Math.floor(numQuants) + 1) / this.quantize;
          this.player.start(playTime);
        }
      } else {
        this.player.start(0); // play the source now
      }
    } else if (evt == 'stillPlaying') {
      this.fxGainNode.gain.value = 1 - y;
      this.player.playbackRate.value = 1.0 + x;
    }
  }
}

export { AudioSampler };
