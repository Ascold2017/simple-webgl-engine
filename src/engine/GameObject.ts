import * as THREE from "three";
import Engine from ".";
import BaseComponent from "./components/BaseComponent";
import components from "./components/components";
type Geometry =
  | "BoxGeometry"
  | "PlaneGeometry"
  | "BufferGeometry"
  | "SphereGeometry";

interface IObject3D {
  geometry: {
    type: Geometry;
    params: {
      width?: number;
      height?: number;
      widthSegments?: number;
      heightSegments?: number;
    };
  };
  material: {
    type: "MeshBasicMaterial" | "MeshStandardMaterial";
    params: THREE.MeshBasicMaterialParameters | THREE.MeshStandardMaterial;
  };
  position: number[];
  rotation: number[];
}

export interface IGameObjectComponentParams {
  name: string;
  type: string;
  variables: Record<string, any>;
  disable: boolean;
}
export interface IGameObject {
  name: string;
  object3D: IObject3D;

  components: Record<string, IGameObjectComponentParams>;
}

export default class GameObject {
  readonly name: string | null;
  private object3D: THREE.Object3D | null = null;
  private components: Record<string, BaseComponent> = {};
  private engine: Engine | null = null;
  private isRemoved: boolean = false;
  constructor(params: IGameObject, engine: Engine) {
    this.name = params.name;
    this.engine = engine;

    this.createObject3D(params.object3D);
    this.createComponents(params.components);
  }
  getObject3D() {
    return this.object3D!;
  }

  private createObject3D(object3DParams: IObject3D) {
    this.object3D = new THREE.Mesh(
      new THREE[object3DParams.geometry.type](
        object3DParams.geometry.params.width,
        object3DParams.geometry.params.height,
        object3DParams.geometry.params.widthSegments,
        object3DParams.geometry.params.heightSegments,
      ),
      new THREE[object3DParams.material.type](
        object3DParams.material.params as any,
      ),
    );
    this.object3D.position.fromArray(object3DParams.position);
    this.object3D.rotation.fromArray(object3DParams.rotation);
  }

  private createComponents(components: Record<string, any>) {
    this.components = {};

    for (var name in components) {
      this.addComponent(name, components[name]);
    }
    this.startComponents();
  }

  private addComponent(name: string, component: any) {
    if (component.disable) return;

    this.components[name] = new components[component.type]({
      gameObject: this,
      engine: this.engine!,
      variables: component.variables,
    });
  }

  startComponents() {
    for (var name in this.components) {
        this.components[name].start();
    }
  }
  destroyComponents() {
    for (var name in this.components) {
      this.components[name].destroy();
    }
  }

  removeComponent(name: string) {
    delete this.components[name];
  }
  getComponent(name: string) {
    return this.components[name];
  }

  update() {
    for (var name in this.components) {
      if (this.isRemoved) return;

      if (!this.components[name].isStart) continue;
      this.components[name].update();
      this.components[name].limitUpdate();
    }
  }
  fixedUpdate() {
    for (var name in this.components) {
      if (this.isRemoved) return;

      if (!this.components[name].isStart) continue;

      this.components[name].fixedUpdate();
    }
  }
  onPointerMove() {
    for (var name in this.components) {
      if (this.isRemoved) return;

      if (!this.components[name].isStart) continue;
      this.components[name].onPointerMove();
    }
  }
  onPointerUp() {
    for (var name in this.components) {
      if (this.isRemoved) return;

      if (!this.components[name].isStart) continue;

      this.components[name].onPointerUp();
    }
  }
  onPointerDown() {
    for (var name in this.components) {
      if (this.isRemoved) return;

      if (!this.components[name].isStart) continue;

        this.components[name].onPointerDown();
    }
  }
  onWheel() {
    for (var name in this.components) {
      if (this.isRemoved) return;

      if (!this.components[name].isStart) continue;

      this.components[name].onWheel();
    }
  }
  onKeyDown(code: string) {
    for (var name in this.components) {
      if (this.isRemoved) return;

      if (!this.components[name].isStart) continue;

        this.components[name].onKeyDown(code);
    }
  }
}
