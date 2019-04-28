import * as THREE from "three";

import Keybinds from "../input/Keybinds";

export default class FirstPersonControls {
	camera = null;
	position = new THREE.Vector3(0, 5, 15);
	speed = 0.25;

	constructor(camera, inputTracker) {
		this.camera = camera;
		this.inputTracker = inputTracker;
	}

	init() {
		this.camera.position.copy(this.position);
	}

	update() {
		const velocity = this.getVelocity();

		this.updatePosition(velocity);
	}

	getVelocity() {
		const velocity = new THREE.Vector3();

		if (this.inputTracker.keysPressed[Keybinds.MoveForward]) {
			velocity.add(new THREE.Vector3(0, 0, -1));
		}

		if (this.inputTracker.keysPressed[Keybinds.MoveBackward]) {
			velocity.add(new THREE.Vector3(0, 0, 1));
		}

		if (this.inputTracker.keysPressed[Keybinds.StrafeLeft]) {
			velocity.add(new THREE.Vector3(-1, 0, 0));
		}

		if (this.inputTracker.keysPressed[Keybinds.StrafeRight]) {
			velocity.add(new THREE.Vector3(1, 0, 0));
		}

		velocity.multiplyScalar(this.speed);

		return velocity;
	}

	updatePosition(velocity) {
		const newPosition = this.position.clone().add(velocity);
		this.position.copy(newPosition);
		this.camera.position.copy(this.position);
	}
}
