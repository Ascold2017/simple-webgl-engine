import { PerspectiveCamera } from "three";
import GameObject, { IGameObject } from "./GameObject";
import Resizer from "./Resizer";
import Updater from "./Updater";
import Viewer, { IViewer } from "./Viewer";

interface IEngine {
    viewer: IViewer
}
export default class Engine {
    private viewer: Viewer | null = null;
    private updater: Updater | null = null;
    private resizer: Resizer | null = null;
    private gameObjects: GameObject[] = []
    constructor(params: IEngine) {
        this.viewer = new Viewer(params.viewer);
        this.updater = new Updater();
        this.resizer = new Resizer();
        this.updater.addLoop('render_update', () => this.viewer!.render());
        this.resizer?.addResize('resize_viewer', () => {
            this.viewer?.setSize();
            this.viewer?.resizeCamera(this.viewer.camera as PerspectiveCamera)
        })
    }

    addGameObject(params: IGameObject) {
        const gameObject = new GameObject(params, this);
        this.viewer?.add(gameObject.getObject3D());
        this.updater?.addLoop(params.name, () => gameObject.update())
        this.gameObjects.push(gameObject)
    }
    removeGameObject(name: string) {
        this.viewer?.remove(name)
        this.updater?.removeLoop(name)
        this.gameObjects = this.gameObjects.filter(go => go.name !== name)
    }
    getGameObjectByName(name: string) {
        return this.gameObjects.find(go => go.name === name)
    }
}