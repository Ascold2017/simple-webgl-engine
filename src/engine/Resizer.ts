export default class Resizer {
  private resizes: Record<string, Function> = {};
  constructor() {
    this.resizes = {};
    window.addEventListener("resize", () => this.onResize());
  }
  addResize(name: string, func: Function) {
    this.resizes[name] = func;
  }
  removeResize(name: string) {
    delete this.resizes[name];
  }
  private onResize() {
    for (var name in this.resizes) this.resizes[name]();
  }
}
