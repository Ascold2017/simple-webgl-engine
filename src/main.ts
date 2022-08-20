import "./style.css";
import Engine from "./engine";


const eng = new Engine({
  viewer: {
    container: document.getElementById('container') as HTMLDivElement,
    settings: {},
    defaultSettings: {
      color: 0x000000,
      colorOpacity: 1,
      alpha: 1
    }
  }
});

eng.addGameObject({
  name: 'plane',
  object3D: {
    geometry: {
      type: 'PlaneGeometry',
      params: { width: 10, height: 10, widthSegments: 12, heightSegments: 12 }
    },
    material: {
      type: 'MeshBasicMaterial',
      params: { color: 0x00ff00, wireframe: true }
    },
    position: [0, 0, -50],
    rotation: [0, 0, 0]
  },
  components: {
    rotation: {
      type: 'Rotation',
      name: 'rotation',
      variables: {},
      disable: false
    }
  }
});


