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

    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader();
    let cubeTexture;

    // new RGBELoader()
    // .setPath('./Textures/')
    // .load('skybox.hdr', function (texture) {
    //     texture.mapping = THREE.EquirectangularReflectionMapping;
    //     texture.flipY = false;
    //     cubeTexture = texture;
    // });
    // const lightMapTexture = new THREE.TextureLoader().load('./Textures/123.png');
    // console.log(lightMapTexture);
    // const baseIntTexturePath = './Textures/PBR_Interior';
    // const walls = {
    //     map: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Walls_Alpha_Mat_BaseColor.png'),
    //     metalness: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Walls_Alpha_Mat_Metallic.png'),
    //     normal: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Walls_Alpha_Mat_Normal.png'),
    //     roughness: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Walls_Alpha_Mat_Roughness.png')
    // };
    // const mirrorStairs = {
    //     map: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Mirriors&Stairs_Alpha_Mat_BaseColor.png'),
    //     metalness: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Mirriors&Stairs_Alpha_Mat_Metallic.png'),
    //     normal: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Mirriors&Stairs_Alpha_Mat_Normal.png'),
    //     roughness: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Mirriors&Stairs_Alpha_Mat_Roughness.png')
    // };
    // const floorRags = {
    //     map: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Floor&Rags&Curtons_Alpha_Mat_BaseColor.png'),
    //     metalness: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Floor&Rags&Curtons_Alpha_Mat_Metallic.png'),
    //     normal: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Floor&Rags&Curtons_Alpha_Mat_Normal.png'),
    //     roughness: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Floor&Rags&Curtons_Alpha_Mat_Roughness.png')
    // };
    // const doorsWindows = {
    //     map: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Doors&WIndows_Alpha_Mat_BaseColor.png'),
    //     metalness: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Doors&WIndows_Alpha_Mat_Metallic.png'),
    //     normal: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Doors&WIndows_Alpha_Mat_Normal.png'),
    //     roughness: textureLoader.load(baseIntTexturePath +'/Studio Apartment_Sub_Doors&WIndows_Alpha_Mat_Roughness.png')
    // };

    //container.appendChild(stats.dom);
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environment = new DebugEnvironment(renderer);
    environment.children.forEach((child) => {
        if(child.isPointLight){
            //console.log(child);
            child.intensity = 1;
        }
    })
    scene.environment = pmremGenerator.fromScene(environment, 0.04).texture;
    //console.log(scene.environment, scene );
    
    //console.log(environment);
    //document.body.appendChild(renderer.domElement);
   
    var params = {
        color: 0xfcf8ec
    };
    const lightSource0 = new THREE.DirectionalLight(params.color, 0.37);
    lightSource0.position.set(1,9,-1);
    lightSource0.castShadow = true;
    scene.add(lightSource0);
   
    gui.addColor( params, 'color' )
    .onChange( function() { lightSource0.color.set( params.color ); } );
    gui.add(lightSource0, "intensity").min(-10).max(10).name("directionalLight1Intensity");
    gui.add(lightSource0.position, "x").min(-10).max(10).name("directionalLight1Position"  + " x");
    gui.add(lightSource0.position, "y").min(-10).max(10).name("directionalLight1Position"  + " y");
    gui.add(lightSource0.position, "z").min(-10).max(10).name("directionalLight1Position"  + " z");
    // const lightSource1 = new THREE.DirectionalLight(pinkColor, pinkIntensity);
    // lightSource1.position.set(1, -2, -4);
    // scene.add(lightSource1);
    var params1 = {
        color: 0xfff0e6
    };
    const lightSource2 = new THREE.DirectionalLight(params1.color, 0.75);
    lightSource2.position.set(1,1,-1);
    //lightSource2.castShadow = true;
    
    gui.addColor( params1, 'color' )
    .onChange( function() { lightSource2.color.set( params1.color ); } );
    gui.add(lightSource2, "intensity").min(-10).max(10).name("directionalLightIntensity2");
    gui.add(lightSource2.position, "x").min(-10).max(10).name("directionalLightPosition2"  + " x");
    gui.add(lightSource2.position, "y").min(-10).max(10).name("directionalLightPosition2"  + " y");
    gui.add(lightSource2.position, "z").min(-10).max(10).name("directionalLightPosition2"  + " z");
    scene.add(lightSource2);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./loaders/dracoGltf/');

    const loader = new GLTFLoader();
    let mixer;
    loader.setDRACOLoader(dracoLoader);
    loader.load('./Ace Apartment_GLB Embeded_M01.glb', function (gltfModel) {
        const model = gltfModel.scene;
        console.log(model);
        model.scale.set(0.4, 0.4, 0.4);
        model.traverse((child) => {
            if (child.isMesh) {
                const material = child.material;
               
                child.castShadow = true;
                child.receiveShadow = true;
                // if (child.name === "Mirriors&Stairs_Alpha") {
                //     material.map = mirrorStairs.map;
                //     material.metalnessMap = mirrorStairs.metalness;
                //     material.normalMap = mirrorStairs.normal;
                //     material.roughnessMap = mirrorStairs.roughness;
                //     if(material.roughnessMap){
                //         material.roughness = 1.0;
                //     } 
                //     if(material.metalnessMap){
                //         material.metalness = 1.0;
                //     }

                // }else if(child.name === "Walls_Alpha"){
                //     material.map = walls.map;
                //     material.metalnessMap = walls.metalness;
                //     material.normalMap = walls.normal;
                //     material.roughnessMap = walls.roughness;

                //     if(material.roughnessMap){
                //         material.roughness = 1.0;
                //     } 
                //     if(material.metalnessMap){
                //         material.metalness = 1.0;
                //     }

                // }else if(child.name === "Doors&WIndows_Alpha_1"){
                //     material.map = doorsWindows.map;
                //     material.metalnessMap = doorsWindows.metalness;
                //     material.normalMap = doorsWindows.normal;
                //     material.roughnessMap = doorsWindows.roughness;

                //     if(material.roughnessMap){
                //         material.roughness = 1.0;
                //     } 
                //     if(material.metalnessMap){
                //         material.metalness = 1.0;
                //     }

                // }

                if (material) {
                    if(child.name == 'Curtons_Transparent'){
                        console.log(material);
                        material.transparent = true;
                        material.opacity = 0.8
                    }
                    // console.log(lightMapTexture)
                    //material.map = lightMapTexture;
                    //material.envMap = cubeTexture;
                    // material.emissive = new THREE.Color(0xff5500);
                    // material.emissiveIntensity = 0.009;
                    
                    material.metalness = 0;
                    material.roughness = 1;
                }
            }
        })
        scene.add(model);
        animate();

    }, function ( xhr ) {
        var loadingPercentage = xhr.loaded * 100 / xhr.total;
        if( Math.floor(loadingPercentage) <= 100){
            document.getElementById('loading').innerHTML = 'The floor is ' + Math.floor(loadingPercentage) + '% loaded.';
        }else {
            setTimeout(()=>{
                document.getElementById('loading').style.display = "none";
            }, 1000);
        }
    }, function (error) {
        console.error(error);
    });
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
    window.addEventListener('click', (event)=>{
        if(event.ctrlKey && event.metaKey){
            gui.show();
        }else if(event.altKey && event.metaKey){
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

} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}