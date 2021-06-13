import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import Stats from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/libs/stats.module.js';
import { ColladaLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/ColladaLoader.js';

let container, stats, clock;
let camera, loader, scene, renderer, model;
let index = 0;

let ModelNames = [
    {
        DIRECTORY: "luxtri",
        NAME: "luxtri",
        CAMERA_POSITION: [1, 0, 0],
        CAMERA_LOOK_AT: [0, 0.15, 0],
    },
    {
        DIRECTORY: "tray",
        NAME: "tray",
        CAMERA_POSITION: [1, 0, 0],
        CAMERA_LOOK_AT: [0, 0.15, 0],
    },
    {
        DIRECTORY: "axepallet",
        NAME: "axepallet",
        CAMERA_POSITION: [3, 0, 0],
        CAMERA_LOOK_AT: [0, 1, 0],
    },
    {
        DIRECTORY: "dovemen",
        NAME: "dovemen",
        CAMERA_POSITION: [1, 0, 0],
        CAMERA_LOOK_AT: [0, 0, 0],
    },
    {
        DIRECTORY: "tres",
        NAME: "tres",
        CAMERA_POSITION: [1, 0, 0],
        CAMERA_LOOK_AT: [0, 0, 0],
    },
    {
        DIRECTORY: "dovedeo",
        NAME: "dovedeo",
        CAMERA_POSITION: [1, 0, 0],
        CAMERA_LOOK_AT: [0, 0, 0],
    },
]

let current_model = ModelNames[0]

init();
animate();

function init() {
    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(current_model.CAMERA_POSITION[0], current_model.CAMERA_POSITION[1], current_model.CAMERA_POSITION[2]);
    camera.lookAt(current_model.CAMERA_LOOK_AT[0], current_model.CAMERA_LOOK_AT[1], current_model.CAMERA_LOOK_AT[2]);

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    const loadingManager = new THREE.LoadingManager(function () {
        scene.add(model);
    });

    loader = new ColladaLoader(loadingManager);

    loader.load('./' + current_model.DIRECTORY + '/' + current_model.NAME + '.dae', function (collada) {
        model = collada.scene;
    });

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 0).normalize();
    scene.add(directionalLight);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth - 300, window.innerHeight - 300);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize);

    return [loader, camera, scene]
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth - 300, window.innerHeight - 300);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    const delta = clock.getDelta();
    if (model !== undefined) {
        model.rotation.y += delta * 0.3;
    }
    renderer.render(scene, camera);
}

function get_next_model() {
    index = index + 1

    if (index === ModelNames.length) {
        index = 0
    }

    return ModelNames[index]
}

function change_model() {
    current_model = get_next_model()

    scene.remove(model)

    loader.load('./' + current_model.DIRECTORY + '/' + current_model.NAME + '.dae', function (collada) {
        model = collada.scene;
    });

    camera.position.set(current_model.CAMERA_POSITION[0], current_model.CAMERA_POSITION[1], current_model.CAMERA_POSITION[2]);
    camera.lookAt(current_model.CAMERA_LOOK_AT[0], current_model.CAMERA_LOOK_AT[1], current_model.CAMERA_LOOK_AT[2]);

}
document.querySelector('button').addEventListener('click', change_model);