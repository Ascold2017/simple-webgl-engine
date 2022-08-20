import Engine from "..";
import GameObject from "../GameObject";
export interface IBaseComponent {
    gameObject: GameObject;
    engine: Engine;
    variables: Record<string, any>
}
export default class BaseComponent {
    protected gameObject: GameObject | null = null;
    protected variables: Record<string, any> = {};
    protected engine: Engine | null = null;
    isStart = false;
    constructor(params: IBaseComponent) {
        this.gameObject = params.gameObject;
        this.variables = params.variables;
        this.engine = params.engine;
    }

    start() {
        this.isStart = true;
    }
    destroy() {
        this.isStart = false;
    }

    update() {}
    limitUpdate() {}
    fixedUpdate() {}
    onPointerMove() {}
    onPointerUp() {}
    onPointerDown() {}
    onWheel() {}
    onKeyDown(code: string) {}

}