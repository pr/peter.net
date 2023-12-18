let viewer
let container
let items
let progressElement
let progress
let images
let startIndex

class ThreeSixtyImage {
    constructor(imageLocation, x, y, z) {
        this.imageLocation = imageLocation;
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

startIndex = -1
images = [
    new ThreeSixtyImage("./assets/images/360/new_york_city_pier_16.jpg", 2.5, 1.5, 3),
    new ThreeSixtyImage("./assets/images/360/new_york_city_statue_of_liberty_interior.jpg", 2.5, 6.5, 3),
    new ThreeSixtyImage("./assets/images/360/new_york_city_statue_of_liberty_exterior.jpg", 8, -1.5, 3),
    new ThreeSixtyImage("./assets/images/360/macau.jpg", 8, -1.5, 3),
    new ThreeSixtyImage("./assets/images/360/columbia.jpg", 8, 3, 3),
    new ThreeSixtyImage("./assets/images/360/florida_2.jpg", 8, -1.5, 3),
]

container = document.querySelector("section.background");
items = document.querySelectorAll(".item");
progressElement = document.getElementById("progress");

viewer = new PANOLENS.Viewer({container: container, controlBar: false});

window.addEventListener("orientationchange", function () {
    setTimeout(function () {
        viewer.onWindowResize(window.innerWidth, window.innerHeight)
    }, 200);
}, false);

function getPanorama() {
    startIndex++

    let image = images[(startIndex) % images.length]
    let panorama = new PANOLENS.ImagePanorama(image.imageLocation);
    let initialLookPosition = new THREE.Vector3(image.x, image.y, image.z);

    return [panorama, initialLookPosition]
}

function onEnter() {
    progressElement.style.width = 0;
    progressElement.classList.remove("finish");
}

function onProgress(event) {
    progress = event.progress.loaded / event.progress.total * 100;
    progressElement.style.width = progress + "%";
    if (progress === 100) {
        progressElement.classList.add("finish");
    }
}

function addDomEvents() {
    container.addEventListener("mousedown", function () {
        this.classList.add("mousedown");
    }, false);

    container.addEventListener("mouseup", function () {
        this.classList.remove("mousedown");
    }, false);

    for (let i = 0, hash; i < items.length; i++) {
        hash = items[i].getAttribute("data-hash");
        if (hash) {
            items[i].addEventListener("click", function () {
                routeTo(this.getAttribute("name"), this);
            }, false);
        }

        if (hash === window.location.hash) {
            routeTo(hash.replace("#", ""), items[i]);
        }
    }
}

function setUpInitialState() {
    const [panorama, initialLookPosition] = getPanorama()

    panorama.addEventListener("progress", onProgress);
    panorama.addEventListener("enter", onEnter);
    panorama.addEventListener("enter-fade-start", function (position) {
        viewer.tweenControlCenter(position, 0);
    }.bind(this, initialLookPosition));
    viewer.add(panorama);
}

function refreshState() {
    const [newPanorama, newLookPosition] = getPanorama()

    viewer.dispose()
    viewer.add(newPanorama)
    viewer.setPanorama(newPanorama)
    viewer.tweenControlCenter(newLookPosition, 0);
}

addDomEvents();
setUpInitialState();
