import * as THREE from "three"

export interface IViewer {
  container: HTMLDivElement,
  settings: THREE.WebGLRendererParameters
  defaultSettings: IViewerSettings
}

interface IViewerSettings {
  shadowMap?: boolean;
  color?: THREE.ColorRepresentation;
  colorOpacity?: number;
  alpha?: number
}
export default class Viewer {
	private container: HTMLDivElement | null = null;
  private width = 0;
  private height = 0;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene = new THREE.Scene();
  camera: THREE.Camera | null = null;
 

	constructor(data: IViewer){
    this.container = data.container;
    this.create(data.settings)
    this.setSettings(data.defaultSettings)
	}

  private create(settings: THREE.WebGLRendererParameters) {
    if(this.renderer) this.renderer.dispose();
	
		this.container!.innerHTML = "";
		
		this.renderer = new THREE.WebGLRenderer(settings);
		
		this.renderer.sortObjects = true;

		this.renderer.setPixelRatio(window.devicePixelRatio);
		
		this.container!.appendChild(this.renderer.domElement);
		
		this.setSize();
    this.createDefaultCamera();

    this.scene.add(new THREE.GridHelper(200, 10, 'red', 'green'))

  }

  setSize() {
		this.width = this.container!.offsetWidth || innerWidth;
		this.height = this.container!.offsetHeight || innerHeight;
		this.renderer!.setSize(this.width,this.height);
	}

  private setSettings(data: IViewerSettings){
		this.renderer!.shadowMap.enabled = data.shadowMap || false;
		this.renderer!.setClearColor(data.color || 0x000000, data.colorOpacity || 0);

		this.renderer!.setClearAlpha(data.alpha || 0)
		
	}

  private createDefaultCamera() {
    const camera = new THREE.PerspectiveCamera()
    camera.position.y = 5;
    this.resizeCamera(camera)
    this.camera = camera;
  }

	resizeCamera(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, size?: number){
		
		
		if(camera.type === "PerspectiveCamera")
		{
			camera.aspect = this.width/this.height;
		}
		else if(camera.type === "OrthographicCamera")
		{
			
			var w = this.width;
			var h = this.height;
			
			camera.left = -1*w/2*(size || 0);
			camera.right = 1*w/2*(size || 0);
			camera.top = 1*h/2*(size || 0);
			camera.bottom = -1*h/2*(size || 0);
			
		}
		camera.updateProjectionMatrix();
	}

  add(object: THREE.Object3D) {
    this.scene.add(object)
  }

  remove(name: string) {
    const obj = this.scene.getObjectByName(name)
    obj && this.scene.remove(obj)
  }

  setCamera(name: string) {
    const camera = this.scene.getObjectByName(name) as THREE.Camera;
    if (camera.isCamera) {
      this.camera = camera;
    }
  }

  render() {
    this.renderer?.render(this.scene, this.camera!)
    
  }
}