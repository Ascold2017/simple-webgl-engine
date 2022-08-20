interface ILoop {
  func: Function;
  isPaused: boolean;
}
export default class Updater {
  private loops: Record<string, ILoop> = {};
  private fixedLoops: Record<string, ILoop> = {};
 //  private limits: Record<string, any> = {};
  private time = 0;
  private delta = 0;
  private maxDelta = 0.1;
  private fps = 75;
  private fixedDelta = .015;
  private lastTime = 0;
  private isStop = false;
  constructor() {
    this.lastTime = Date.now();
    this.update();
    this.startFixedUpdate();
  }
  get totalTime() {
    return this.time;
  }
  pause() {
    this.isStop = true;
  }
  unpause() {
    this.isStop = false;
  }
  pauseLoop(name: string) {
    this.loops[name].isPaused = true;
  }
  unpauseLoop(name: string) {
    this.loops[name].isPaused = false;
  }
  resetDelta() {
    this.delta = 0;
  }
  addLoop(name: string, func: Function) {
    this.loops[name] = { func, isPaused: false };
  }
  removeLoop(name: string) {
    delete this.loops[name];
  }
  addFixedLoop(name: string, func: Function) {
    this.fixedLoops[name] = { func, isPaused: false };
  }
  removeFixedLoop(name: string) {
    delete this.fixedLoops[name];
  }

  startFixedUpdate() {
    setInterval(
      () => this.fixedUpdate(),
      this.fixedDelta * 1000,
    );
  }
  private fixedUpdate() {
    if (this.isStop) return;
    for (const loop in this.fixedLoops) {
      if (!this.fixedLoops[loop].isPaused) this.fixedLoops[loop].func();
    }
  }
  private update() {
    requestAnimationFrame(this.update.bind(this));
    if (this.isStop) return;
    this.delta = (Date.now() - this.lastTime) / 1000;
    this.time += this.delta;
    if (this.delta > this.maxDelta) this.delta = this.maxDelta;

    if (this.delta < 1 / this.fps) return;

    this.lastTime = Date.now();

    for (var l in this.loops) {
      if (!this.loops[l].isPaused) this.loops[l].func();
    }
  }
}
