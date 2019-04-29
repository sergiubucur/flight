import * as THREE from "three";

import AssetLibrary from "./asset-library/AssetLibrary";
import Logger from "./logger/Logger";
import CreditsBox from "./credits-box/CreditsBox";
import World from "./world/World";
import InputTracker from "./input/InputTracker";
import FirstPersonControls from "./first-person-controls/FirstPersonControls";
import Spaceship from "./spaceship/Spaceship";
import Constants from "./Constants";

const AntiAliasing = true;
const HalfSizeRendering = true;
const FirstPersonControlsMode = false;

export default class Core {
	assetLibrary = null;
	logger = null;
	inputTracker = null;
	camera = null;
	firstPersonControls = null;
	world = null;
	renderer = null;
	creditsBox = null;

	init() {
		this.assetLibrary = new AssetLibrary();
		this.assetLibrary.init().then(() => {
			this.initLogger();
			this.initCreditsBox();
			this.initInputTracker();
			this.initCamera();
			this.initWorld();

			if (FirstPersonControlsMode) {
				this.initFirstPersonControls();
			} else {
				this.initSpaceship();
			}

			this.initRenderer();

			this.removeLoadingBar();
			this.run();
		});
	}

	initLogger() {
		this.logger = new Logger();
		this.logger.init();
	}

	initCreditsBox() {
		this.creditsBox = new CreditsBox();
		this.creditsBox.init();
	}

	initInputTracker() {
		this.inputTracker = new InputTracker(this.logger);
		this.inputTracker.usePointerLock = FirstPersonControlsMode;
		this.inputTracker.init();
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, Constants.DrawDistance);
	}

	initFirstPersonControls() {
		this.firstPersonControls = new FirstPersonControls(this.camera, this.inputTracker, this.logger, this.world);
		this.firstPersonControls.init();
	}

	initWorld() {
		this.world = new World(this.assetLibrary, this.logger);
		this.world.init();
	}

	initSpaceship() {
		this.spaceship = new Spaceship(this.camera, this.inputTracker, this.logger, this.world, this.assetLibrary);
		this.spaceship.init();

		this.world.scene.add(this.spaceship.mesh);
	}

	initRenderer() {
		let width = window.innerWidth;
		let height = window.innerHeight;

		if (HalfSizeRendering) {
			width /= 2;
			height /= 2;
		}

		this.renderer = new THREE.WebGLRenderer({ antialias: AntiAliasing });
		this.renderer.setSize(width, height);

		document.body.appendChild(this.renderer.domElement);

		if (HalfSizeRendering) {
			this.renderer.domElement.style.width = width * 2 + "px";
			this.renderer.domElement.style.height = height * 2 + "px";
		}
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

		if (!FirstPersonControlsMode) {
			this.logger.log("←↑↓→ - Steering");
			this.logger.log("W - Acceleration");
			this.logger.log("Space - Turbo Mode");
			this.logger.log();
		}

		this.world.update();

		if (FirstPersonControlsMode) {
			this.firstPersonControls.update();
		} else {
			this.spaceship.update();
		}

		this.inputTracker.update();
	}

	draw() {
		this.renderer.render(this.world.scene, this.camera);
	}
}
