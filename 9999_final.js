const init = () => {

    const width = 800;
    const height = 600;
    const renderDiv = document.getElementById("renderspace");

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    renderDiv.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('lightblue', 300, 1000);

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(90, 76, 400);
    camera.lookAt(0, 0, 0);

    const controls = new THREE.OrbitControls(camera, renderDiv);

    const moonLight = new THREE.HemisphereLight(0xffffbb, 0xe0ecff, 0.3)
    moonLight.position.set(0, 200, 0);
    scene.add(moonLight);


    // const gridHelper = new THREE.GridHelper(100, 10); // size, step
    // scene.add(gridHelper);
    // const axisHelper = new THREE.AxesHelper(100); //軸の長さ　X：赤、Y：緑、z：青
    // scene.add(axisHelper);

    const textureLoader = new THREE.TextureLoader();
    const groundTexture = textureLoader.load("./images/ground.jpg");
    const grassTexture = textureLoader.load("./images/grass.png");

    const stoneTexture = textureLoader.load("./images/stone.jpg", (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(5, 5);
    });
    const stoneBump = textureLoader.load("./images/stone-bump.jpg", (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(5, 5);
    });
    const stoneMaterial = new THREE.MeshPhongMaterial();
    stoneMaterial.map = stoneTexture;
    stoneMaterial.bumpMap = stoneBump;
    stoneMaterial.bumpscale = 0.4;

    const tree0Material = new THREE.SpriteMaterial({
        map: textureLoader.load("./images/tree0.png")
    });

    {/* ----- left side tree ----- */}
    for (let i = 0; i < 12; i++) {
        const sprite = new THREE.Sprite(tree0Material);
        sprite.position.x = -100;
        sprite.position.y = 40;
        sprite.position.z = -280 + i * 40;
        sprite.scale.set(80, 80, 80);
        scene.add(sprite);
    }
    {/* -------------------- */}


    {/* ----- right side tree ----- */}
    for (let i = 0; i < 12; i++) {
        const sprite = new THREE.Sprite(tree0Material);
        sprite.position.x = 100;
        sprite.position.y = 40;
        sprite.position.z = -280 + i * 40;
        sprite.scale.set(80, 80, 80);
        scene.add(sprite);
    }
    {/* -------------------- */}


    {/* ----- Particle Builder ----- */}
    const size = 2000;
    const n = 1000000;

    const vertices = [];
    for (let i = 0; i < n; i++) {
        const x = size * (Math.random() - 0.5);
        const y = size * (Math.random() - 0.5);
        const z = size * (Math.random() - 0.5);

        vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
    );

    const material = new THREE.PointsMaterial({
        size: 1,
        color: 0xffffff,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    {/* -------------------- */}


    const groundMaterial = new THREE.MeshBasicMaterial({
        map: groundTexture
    });

    const grassMaterial = new THREE.MeshPhongMaterial({
        map: grassTexture
    });

    const planeGeometry = new THREE.PlaneGeometry(300, 640, 500);
    const plane = new THREE.Mesh(planeGeometry, grassMaterial);
    plane.rotation.set(-Math.PI/2, 0, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    const roadGeometry = new THREE.PlaneGeometry(150, 600, 1000);
    const road = new THREE.Mesh(roadGeometry, stoneMaterial);
    road.rotation.set(-Math.PI/2, 0, 0);
    road.position.set(0, 2, -20);
    road.receiveShadow = true;
    scene.add(road);


    {/* ----- Shrine archway Builder ----- */}
    const baseCylinderGeometry = new THREE.CylinderGeometry(3, 4, 50, 20);
    const baseCylinderMaterial = new THREE.MeshPhongMaterial( {color: 0xff3103} );

    const baseLeftCylinder = new THREE.Mesh(baseCylinderGeometry, baseCylinderMaterial);
    baseLeftCylinder.position.set(0, 25, 0);
    baseLeftCylinder.rotation.set(0, 0, -Math.PI/60);

    const baseRightCylinder = new THREE.Mesh(baseCylinderGeometry, baseCylinderMaterial);
    baseRightCylinder.position.set(30, 25, 0);
    baseRightCylinder.rotation.set(0, 0, Math.PI/60);

    const crossPathGeometry = new THREE.BoxGeometry(50, 5, 2);
    const crossPathMaterial = new THREE.MeshBasicMaterial( {color: 0xff3103} );
    const crossPath = new THREE.Mesh(crossPathGeometry, crossPathMaterial);
    crossPath.position.set(15, 40, 0);

    const middlePathGeometry = new THREE.BoxGeometry(5, 10, 2);
    const middlePathMaterial = new THREE.MeshBasicMaterial( {color: 0xff3103} );
    const middlePath = new THREE.Mesh(middlePathGeometry, middlePathMaterial);
    middlePath.position.set(15, 45, 0);

    const topPathGeometry = new THREE.BoxGeometry(55, 5, 6);
    const topPathMaterial = new THREE.MeshBasicMaterial( {color: 0xff3103} );
    const topCrossPath = new THREE.Mesh(topPathGeometry, topPathMaterial);
    topCrossPath.position.set(15, 50, 0);

    const archwayGroup = new THREE.Group();
    archwayGroup.add(baseLeftCylinder);
    archwayGroup.add(baseRightCylinder);
    archwayGroup.add(crossPath);
    archwayGroup.add(middlePath);
    archwayGroup.add(topCrossPath);
    archwayGroup.castShadow = true;

    for (let i = 0; i < 5; i++) {
        const archway = archwayGroup.clone();
        archway.position.set(-27, 0, -(30 + i*50));
        archway.scale.set(1.8, 1.8, 1.8);
        scene.add(archway);

        const pointLight = new THREE.PointLight(0xBC7701, 3, 100, 0.5);
        pointLight.position.set(0, 10, -(30 + i*50));
        scene.add(pointLight);
    }
    {/* ------------------------- */}


    {/* ----- Lantern Builder ----- */}
    const basePoleGeometry = new THREE.CylinderGeometry(2, 2, 26, 20);
    const baseLanternMaterial = new THREE.MeshPhongMaterial( {color: 0xff3103} );

    const baseStoneGeometry = new THREE.CylinderGeometry(4, 4, 1, 20);

    const baseCrossFrameGeometry = new THREE.BoxGeometry(2, 10, 2);
    const baseTopFrameGeometry = new THREE.BoxGeometry(6, 2, 2);

    const basePanelGeometry = new THREE.PlaneGeometry(8, 8, 8);

    const topStoneGeometry = new THREE.CylinderGeometry(1, 3, 4);

    const baseStone = new THREE.Mesh(baseStoneGeometry, groundMaterial);
    baseStone.position.set(0, 1, 0);


    const basePole = new THREE.Mesh(basePoleGeometry, baseLanternMaterial);
    basePole.position.set(0, 14, 0);

    const baseLowerPanel = new THREE.Mesh(basePanelGeometry, baseLanternMaterial);
    baseLowerPanel.material.side = THREE.DoubleSide;
    baseLowerPanel.rotation.set(Math.PI/2, 0, 0);
    baseLowerPanel.position.set(0, 27, 0);

    const baseUpperPanel = new THREE.Mesh(basePanelGeometry, baseLanternMaterial);
    baseUpperPanel.material.side = THREE.DoubleSide;
    baseUpperPanel.rotation.set(Math.PI/2, 0, 0);
    baseUpperPanel.position.set(0, 37, 0);

    const baseCrossFrame1 = new THREE.Mesh(baseCrossFrameGeometry, baseLanternMaterial);
    baseCrossFrame1.position.set(3, 32, 3);

    const baseCrossFrame2 = new THREE.Mesh(baseCrossFrameGeometry, baseLanternMaterial);
    baseCrossFrame2.position.set(-3, 32, 3);

    const baseCrossFrame3 = new THREE.Mesh(baseCrossFrameGeometry, baseLanternMaterial);
    baseCrossFrame3.position.set(3, 32, -3);

    const baseCrossFrame4 = new THREE.Mesh(baseCrossFrameGeometry, baseLanternMaterial);
    baseCrossFrame4.position.set(-3, 32, -3);


    const baseLowerFrame1 = new THREE.Mesh(baseTopFrameGeometry, baseLanternMaterial);
    baseLowerFrame1.position.set(0, 28, 5);
    scene.add(baseLowerFrame1);

    const baseLowerFrame2 = new THREE.Mesh(baseTopFrameGeometry, baseLanternMaterial);
    baseLowerFrame2.position.set(0, 28, -5);
    scene.add(baseLowerFrame2);

    const baseLowerFrame3 = new THREE.Mesh(baseTopFrameGeometry, baseLanternMaterial);
    baseLowerFrame3.rotation.set(0, Math.PI/2, 0);
    baseLowerFrame3.position.set(-5, 28, 0);
    scene.add(baseLowerFrame3);

    const baseLowerFrame4 = new THREE.Mesh(baseTopFrameGeometry, baseLanternMaterial);
    baseLowerFrame4.rotation.set(0, Math.PI/2, 0);
    baseLowerFrame4.position.set(5, 28, 0);
    scene.add(baseLowerFrame4);


    const baseUpperFrame1 = new THREE.Mesh(baseTopFrameGeometry, baseLanternMaterial);
    baseUpperFrame1.position.set(0, 36, 5);
    scene.add(baseUpperFrame1);

    const baseUpperFrame2 = new THREE.Mesh(baseTopFrameGeometry, baseLanternMaterial);
    baseUpperFrame2.position.set(0, 36, -5);
    scene.add(baseUpperFrame2);

    const baseUpperFrame3 = new THREE.Mesh(baseTopFrameGeometry, baseLanternMaterial);
    baseUpperFrame3.rotation.set(0, Math.PI/2, 0);
    baseUpperFrame3.position.set(-5, 36, 0);
    scene.add(baseUpperFrame3);

    const baseUpperFrame4 = new THREE.Mesh(baseTopFrameGeometry, baseLanternMaterial);
    baseUpperFrame4.rotation.set(0, Math.PI/2, 0);
    baseUpperFrame4.position.set(5, 36, 0);
    scene.add(baseUpperFrame4);

    const topStone = new THREE.Mesh(topStoneGeometry, groundMaterial);
    topStone.position.set(0, 39, 0);
    scene.add(topStone);

    const lanternGroup = new THREE.Group();
    lanternGroup.add(baseStone);
    lanternGroup.add(basePole);
    lanternGroup.add(baseLowerPanel);
    lanternGroup.add(baseUpperPanel);
    lanternGroup.add(baseCrossFrame1);
    lanternGroup.add(baseCrossFrame2);
    lanternGroup.add(baseCrossFrame3);
    lanternGroup.add(baseCrossFrame4);
    lanternGroup.add(baseLowerFrame1);
    lanternGroup.add(baseLowerFrame2);
    lanternGroup.add(baseLowerFrame3);
    lanternGroup.add(baseLowerFrame4);
    lanternGroup.add(baseUpperFrame1);
    lanternGroup.add(baseUpperFrame2);
    lanternGroup.add(baseUpperFrame3);
    lanternGroup.add(baseUpperFrame4);
    lanternGroup.add(topStone);
    lanternGroup.castShadow = true;
    lanternGroup.receiveShadow = true;

    for (let i = 0; i < 6; i++) {
        const leftLantern = lanternGroup.clone();
        leftLantern.position.set(-50, 0, 20 + i*50);
        scene.add(leftLantern);

        const pointLight = new THREE.PointLight(0xBC7701, 1, 100, 0.5);
        pointLight.position.set(-50, 32, 20 + i*50);
        scene.add(pointLight);
    }

    for (let i = 0; i < 6; i++) {
        const rightLantern = lanternGroup.clone();
        rightLantern.position.set(50, 0, 20 + i*50);
        scene.add(rightLantern);

        const pointLight = new THREE.PointLight(0xBC7701, 1, 100, 0.5);
        pointLight.position.set(50, 32, 20 + i*50);
        scene.add(pointLight);
    }
    {/* -------------------- */}


    const update = () => {
        requestAnimationFrame(update);

        points.rotation.x += 0.0005;

        renderer.setClearColor(new THREE.Color().setStyle(document.getElementById("bg-color").value), 1.0);

        // Orbit controller
        controls.enableDamping = document.getElementById("enable-damping").checked;
        controls.autoRotate = document.getElementById("auto-rotate").checked;
        controls.autoRotateSpeed = document.getElementById("auto-rotate-speed").value;

        let coordinatesSpace = document.getElementById("camera_coordinates");
        let rotateSpeedSpace = document.getElementById("auto_rotate_speed");
        coordinatesSpace.innerHTML = `Camera Coordinates: ${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}`;
        rotateSpeedSpace.innerHTML = `Auto Rotate Speed: ${document.getElementById("auto-rotate-speed").value}`;

        controls.update();
        renderer.render(scene, camera);
    };
    update();
}

window.addEventListener('DOMContentLoaded', init);