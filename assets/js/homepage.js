"use strict";
let camera
let scene
let element = document.getElementsByClassName("background")[0]
let renderer
let onPointerDownPointerX
let onPointerDownPointerY
let onPointerDownLon
let onPointerDownLat
let field_of_view = 70
let isUserInteracting = false
let latitude = 0
let longitude = 0
let phi = 0
let theta = 0
let ratio =  window.innerWidth / window.innerHeight
let images
let startIndex
let texture
let mesh

// Huge thanks to https://norikdavtian.github.io/ThreeJS-360-Panorama/

class ThreeSixtyImage {
    constructor(imageLocation, start_latitude, start_longitude) {
        this.imageLocation = imageLocation;
        this.start_latitude = start_latitude;
        this.start_longitude = start_longitude;
    }
}

startIndex = -1
images = [
    new ThreeSixtyImage("./assets/images/360/new_york_city_pier_16.jpg", -15, -30),
    new ThreeSixtyImage("./assets/images/360/new_york_city_statue_of_liberty_exterior.jpg", 15, -10),
    new ThreeSixtyImage("./assets/images/360/new_york_city_statue_of_liberty_interior.jpg", -50, -10),
    new ThreeSixtyImage("./assets/images/360/macau.jpg", 0, 150),
    new ThreeSixtyImage("./assets/images/360/columbia.jpg", -20, 3),
    new ThreeSixtyImage("./assets/images/360/florida.jpg", 0, 190),
]

function loadMesh() {
    startIndex++

    let image = images[(startIndex) % images.length]

    texture = new THREE.TextureLoader().load(image.imageLocation)
    mesh = new THREE.Mesh(new THREE.SphereGeometry(500, 60, 40), new THREE.MeshBasicMaterial({map: texture}));
    mesh.scale.x = -1;

    latitude = image.start_latitude
    longitude = image.start_longitude
}


function init() {
    camera = new THREE.PerspectiveCamera(field_of_view, ratio, 1, 1000);
    scene = new THREE.Scene();
    loadMesh()
    scene.add(mesh);
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    element.appendChild(renderer.domElement);
    element.addEventListener("mousedown", onDocumentMouseDown, false);
    window.addEventListener("resize", onWindowResized, false);
    onWindowResized();
}

function onWindowResized() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix(field_of_view, window.innerWidth / window.innerHeight, 1, 1100);
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = longitude;
    onPointerDownLat = latitude;
    isUserInteracting = true;
    element.addEventListener("mousemove", onDocumentMouseMove, false);
    element.addEventListener("mouseup", onDocumentMouseUp, false);
}

function onDocumentMouseMove(event) {
    longitude = (event.clientX - onPointerDownPointerX) * -0.175 + onPointerDownLon;
    latitude = (event.clientY - onPointerDownPointerY) * -0.175 + onPointerDownLat;
}

function onDocumentMouseUp() {
    isUserInteracting = false;
    element.removeEventListener("mousemove", onDocumentMouseMove, false);
    element.removeEventListener("mouseup", onDocumentMouseUp, false);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    if (isUserInteracting === false) {
        longitude += .025;
    }
    latitude = Math.max(-85, Math.min(85, latitude));
    phi = THREE.Math.degToRad(90 - latitude);
    theta = THREE.Math.degToRad(longitude);
    camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
    camera.position.y = 100 * Math.cos(phi);
    camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

function refreshMesh() {
    scene.remove(mesh)
    loadMesh()
    scene.add(mesh)
}

init();
animate();