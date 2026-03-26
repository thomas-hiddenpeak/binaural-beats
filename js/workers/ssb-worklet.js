'use strict';

class SSBProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.rL = null; this.iL = null; this.rR = null; this.iR = null;
    this.pos = 0; this.phL = 0; this.phR = 0;
    this.sL = 0; this.sR = 5; this.loop = true;
    this.dLen = 0; this.cfLen = 2048;
    this.ready = false; this.active = true;
    this.alternating = false; this.swapped = false;

    this.port.onmessage = (e) => {
      const d = e.data;
      if (d.type === 'load') {
        this.rL = new Float32Array(d.realL);
        this.iL = new Float32Array(d.imagL);
        if (d.realR) {
          this.rR = new Float32Array(d.realR);
          this.iR = new Float32Array(d.imagR);
        } else {
          this.rR = this.rL;
          this.iR = this.iL;
        }
        this.dLen = this.rL.length;
        this.pos = 0; this.phL = 0; this.phR = 0;
        this.ready = true;
      } else if (d.type === 'shifts') {
        this.sL = d.shiftL;
        this.sR = d.shiftR;
      } else if (d.type === 'loop') {
        this.loop = d.loop;
      } else if (d.type === 'alternating') {
        this.alternating = d.alternating;
        if (!d.alternating) this.swapped = false;
      } else if (d.type === 'stop') {
        this.active = false;
      }
    };
  }

  process(inputs, outputs) {
    if (!this.active) return false;
    if (!this.ready) return true;

    const outL = outputs[0][0], outR = outputs[0][1];
    if (!outL || !outR) return true;

    const len = outL.length;
    const sL = this.sL, sR = this.sR, sr = sampleRate;
    const T = 6.283185307179586;
    const pIL = T * sL / sr, pIR = T * sR / sr;
    const dL = this.dLen, cf = this.cfLen;
    const aLR = this.rL, aLI = this.iL, aRR = this.rR, aRI = this.iR;

    for (let i = 0; i < len; i++) {
      if (this.pos >= dL) {
        if (this.loop) {
          this.pos = cf;
          if (this.alternating) this.swapped = !this.swapped;
        }
        else { outL[i] = 0; outR[i] = 0; continue; }
      }

      let rL = aLR[this.pos], hL = aLI[this.pos];
      let rR = aRR[this.pos], hR = aRI[this.pos];

      // Loop crossfade
      if (this.loop && this.pos >= dL - cf && dL > cf * 2) {
        const fo = (dL - this.pos) / cf, fi = 1 - fo;
        const wp = this.pos - (dL - cf);
        rL = rL * fo + aLR[wp] * fi; hL = hL * fo + aLI[wp] * fi;
        rR = rR * fo + aRR[wp] * fi; hR = hR * fo + aRI[wp] * fi;
      }

      // SSB frequency shift (swap if alternating)
      const effSL = this.swapped ? sR : sL;
      const effSR = this.swapped ? sL : sR;

      if (effSL === 0) outL[i] = rL;
      else outL[i] = rL * Math.cos(this.phL) - hL * Math.sin(this.phL);

      if (effSR === 0) outR[i] = rR;
      else outR[i] = rR * Math.cos(this.phR) - hR * Math.sin(this.phR);

      this.phL += T * effSL / sr; this.phR += T * effSR / sr;
      if (this.phL > T) this.phL -= T;
      else if (this.phL < -T) this.phL += T;
      if (this.phR > T) this.phR -= T;
      else if (this.phR < -T) this.phR += T;

      this.pos++;
    }
    return true;
  }
}

registerProcessor('ssb-processor', SSBProcessor);
