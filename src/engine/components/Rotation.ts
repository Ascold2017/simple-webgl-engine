import BaseComponent, { IBaseComponent } from "./BaseComponent";

export default class Rotation extends BaseComponent {
    constructor(params: IBaseComponent) {
        super(params)
    }

    update() {
        const object3D = this.gameObject!.getObject3D();
        object3D.rotation.y += 0.1;
    }
}