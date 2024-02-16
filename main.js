import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GSAP from "gsap";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import Stats from 'three/addons/libs/stats.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { DebugEnvironment } from 'three/addons/environments/DebugEnvironment.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import * as dat from 'dat.gui';

var webGLCompatibility = WebGL.isWebGLAvailable();
if (webGLCompatibility) {
    const floorsList = [
        {
            id: 1,
            name: './groundFloor.glb'
        },
        {
            id: 2,
            name: './firstFloor.glb'
        }
    ]
    const gui = new dat.GUI();
    const scene = new THREE.Scene();
    //const stats = new Stats();
    scene.background = new THREE.Color(0xbfbfbf);
    const fieldOfView = 50;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, near, far);
    const canvas = document.querySelector("#canvas");
    const container = document.getElementById('container');
    let pointLight;
    const loadingManager = new THREE.LoadingManager();
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environment = new DebugEnvironment(renderer);
    environment.children.forEach((child) => {
        if (child.isPointLight) {
            pointLight = child;
            pointLight.intensity = 30;
        }
    })
    scene.environment = pmremGenerator.fromScene(environment, 0.04).texture;
    var param = {
        color: 0xffffff
    };
    console.log(pointLight)
    pointLight.color.set(param.color);
    gui.addColor(param, 'color').onChange(function () {
        pointLight.color.set(param.color);
        scene.environment = pmremGenerator.fromScene(environment, 0.04).texture;
    });
    gui.add(pointLight, "intensity").min(-10).max(1000).name("environmentLight").onChange(function () {
        scene.environment = pmremGenerator.fromScene(environment, 0.04).texture;
    });

    var params = {
        color: 0xffffff
    };
    const lightSource0 = new THREE.DirectionalLight(params.color, 0.37);
    lightSource0.position.set(1, 9, -1);
    lightSource0.castShadow = true;
    scene.add(lightSource0);

    gui.addColor(params, 'color')
        .onChange(function () { lightSource0.color.set(params.color); });
    gui.add(lightSource0, "intensity").min(-10).max(10).name("directionalLight1Intensity");
    gui.add(lightSource0.position, "x").min(-10).max(10).name("directionalLight1Position" + " x");
    gui.add(lightSource0.position, "y").min(-10).max(10).name("directionalLight1Position" + " y");
    gui.add(lightSource0.position, "z").min(-10).max(10).name("directionalLight1Position" + " z");
    // const lightSource1 = new THREE.DirectionalLight(pinkColor, pinkIntensity);
    // lightSource1.position.set(1, -2, -4);
    // scene.add(lightSource1);
    var params1 = {
        color: 0xffffff
    };
    const lightSource2 = new THREE.DirectionalLight(params1.color, 0.75);
    lightSource2.position.set(1, 1, -1);
    //lightSource2.castShadow = true;

    gui.addColor(params1, 'color')
        .onChange(function () { lightSource2.color.set(params1.color); });
    gui.add(lightSource2, "intensity").min(-10).max(10).name("directionalLightIntensity2");
    gui.add(lightSource2.position, "x").min(-10).max(10).name("directionalLightPosition2" + " x");
    gui.add(lightSource2.position, "y").min(-10).max(10).name("directionalLightPosition2" + " y");
    gui.add(lightSource2.position, "z").min(-10).max(10).name("directionalLightPosition2" + " z");
    scene.add(lightSource2);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./loaders/dracoGltf/');

    const loader = new GLTFLoader();
    let currentFloor, selectedFloor;
    loader.setDRACOLoader(dracoLoader);
    function loadModel(floorNum) {
        document.getElementById('floorNumber').innerHTML = floorNum;
        if (currentFloor) {
            scene.remove(currentFloor);
        } else {
            floorsList.forEach((val) => {
                if (val.id === floorNum) {
                    loader.load(val.name, function (gltfModel) {
                        currentFloor = gltfModel.scene;

                        currentFloor.scale.set(0.4, 0.4, 0.4);
                        currentFloor.traverse((child) => {
                            if (child.isMesh) {
                                const material = child.material;
                                child.castShadow = true;
                                child.receiveShadow = true;
                                if (material) {
                                    material.metalness = 0;
                                    material.roughness = 1;
                                }
                                console.log(child)
                                if (child.name === "Curtons_Transparent") {
                                    material.transparent = true;
                                    material.opacity = 0.7;
                                }
                            }
                        })
                        scene.add(currentFloor);
                        animate();

                    }, function (xhr) {
                        var loadingPercentage = xhr.loaded * 100 / xhr.total;
                        if (Math.floor(loadingPercentage) < 100) {
                            console.log(Math.floor(loadingPercentage))
                            document.getElementById('loading').innerHTML = 'Current floor is ' + Math.floor(loadingPercentage) + '% loaded.';
                        } else {
                            setTimeout(() => {
                                document.getElementById('nav').style.display = "none";
                                document.getElementById('loading').style.display = "none";
                                console.log(document.getElementById('loading').style);
                            }, 1500);
                        }
                    }, function (error) {
                        console.error(error);
                    });
                }
            })
        }
    }
    camera.position.x = 4;
    camera.position.y = 7;
    camera.position.z = 10;
    const modelControls = new OrbitControls(camera, canvas);
    const initialTarget = new THREE.Vector3(0, 0, 0);
    modelControls.target.copy(initialTarget);
    const minPan = new THREE.Vector3(-1, -1, -1);
    const maxPan = new THREE.Vector3(1, 1, 1);
    modelControls.enableDamping = true;
    modelControls.enablePan = true;
    modelControls.autoRotate = false;
    modelControls.autoRotateSpeed = 5;
    modelControls.enableZoom = true;
    modelControls.minPolarAngle = Math.PI / 6;
    modelControls.maxPolarAngle = Math.PI / 2;
    const initialMinZoom = 5;
    const initialMaxZoom = 25;
    modelControls.minDistance = initialMinZoom;
    modelControls.maxDistance = initialMaxZoom;
    gui.hide();
    window.addEventListener('click', (event) => {
        if (event.ctrlKey && event.metaKey) {
            gui.show();
        } else if (event.altKey && event.metaKey) {
            gui.hide();
        }
    })
    function animate() {
        // setTimeout(function () {
        requestAnimationFrame(animate);
        // }, 1000 / 60);
        modelControls.update();
        //stats.update();
        // const delta = clock.getDelta();
        // mixer.update(delta);
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        modelControls.target.clamp(minPan, maxPan);
        renderer.setPixelRatio(2);
        renderer.render(scene, camera);
    }

    const backButton = document.querySelector('#backButton');
    const nextButton = document.querySelector('#nextButton');

    function lastFloor(num) {
        if (selectedFloor) {
            selectedFloor += num;
        }

        loadModel(selectedFloor);
    }
    function nextFloor(num) {
        if (selectedFloor) {
            selectedFloor += num;
        }
        loadModel(selectedFloor);
    }
    backButton.addEventListener('click', function () {
        lastFloor(-1);
    });
    nextButton.addEventListener('click', function () {
        nextFloor(1);
    });
    loadModel(1);
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}