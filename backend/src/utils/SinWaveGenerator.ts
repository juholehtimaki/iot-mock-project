export class SinWaveGenerator {
  private frequency: number;
  private amplitude: number;
  private phase: number;

  constructor(frequency: number, amplitude: number, phase: number = 0) {
    this.frequency = frequency;
    this.amplitude = amplitude;
    this.phase = phase;
  }

  getValueAtTime(t: number): number {
    const angularFrequency = 2 * Math.PI * this.frequency;
    return this.amplitude * Math.sin(angularFrequency * t + this.phase);
  }

  getValue() {
    return this.getValueAtTime(Date.now() / 1000);
  }
}
