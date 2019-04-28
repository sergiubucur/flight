import * as THREE from "three";

import AssetLibrary from "./asset-library/AssetLibrary";
import Logger from "./logger/Logger";
import World from "./world/World";
import InputTracker from "./input/InputTracker";
import FirstPersonControls from "./camera/FirstPersonControls";

export default class Core {
	assetLibrary = null;
	logger = null;
	inputTracker = null;
	camera = null;
	firstPersonControls = null;
	world = null;
	renderer = null;

	init() {
		this.assetLibrary = new AssetLibrary();
		this.assetLibrary.init().then(() => {
			this.initLogger();
			this.initInputTracker();
			this.initCamera();
			this.initWorld();
			this.initRenderer();

			this.removeLoadingBar();
			this.run();
		});
	}

	initLogger() {
		this.logger = new Logger();
		this.logger.init();
	}

	initInputTracker() {
		this.inputTracker = new InputTracker(this.logger);
		this.inputTracker.init();
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);

		this.firstPersonControls = new FirstPersonControls(this.camera, this.inputTracker, this.logger);
		this.firstPersonControls.init();
	}

	initWorld() {
		this.world = new World(this.assetLibrary);
		this.world.init();
	}

	initRenderer() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		document.body.appendChild(this.renderer.domElement);
	}

	removeLoadingBar() {
		const element = document.querySelector("body > .loading");
		document.body.removeChild(element);
	}

	run() {
		requestAnimationFrame(() => this.run());

		this.update();
		this.draw();
	}

	update() {
		this.logger.update();
		this.world.update();
		this.firstPersonControls.update();
		this.inputTracker.update();
	}

	draw() {
		this.renderer.render(this.world.scene, this.camera);
	}
}
