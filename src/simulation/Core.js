import * as THREE from "three";

import World from "./world/World";
import InputTracker from "./input/InputTracker";
import FirstPersonControls from "./camera/FirstPersonControls";

export default class Core {
	camera = null;
	firstPersonControls = null;
	world = null;
	renderer = null;

	init() {
		this.initInputTracker();
		this.initCamera();
		this.initWorld();
		this.initRenderer();
	}

	initInputTracker() {
		this.inputTracker = new InputTracker();
		this.inputTracker.init();
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);

		this.firstPersonControls = new FirstPersonControls(this.camera, this.inputTracker);
		this.firstPersonControls.init();
	}

	initWorld() {
		this.world = new World();
		this.world.init();
	}

	initRenderer() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		document.body.appendChild(this.renderer.domElement);
	}

	run() {
		requestAnimationFrame(() => this.run());

		this.update();
		this.draw();
	}

	update() {
		this.firstPersonControls.update();

		// this.world.groundMesh.rotation.y += 0.01;
	}

	draw() {
		this.renderer.render(this.world.scene, this.camera);
	}
}
