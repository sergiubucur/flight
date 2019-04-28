import * as THREE from "three";

import World from "./world/World";

export default class Core {
	camera = null;
	world = null;
	renderer = null;

	init() {
		this.initCamera();
		this.initWorld();
		this.initRenderer();
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
		this.camera.position.set(0, 5, 15);
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
		this.world.groundMesh.rotation.y += 0.01;
	}

	draw() {
		this.renderer.render(this.world.scene, this.camera);
	}
}
