import * as THREE from "three";

import Keybinds from "../input/Keybinds";

export default class FirstPersonControls {
	camera = null;
	position = new THREE.Vector3(0, 5, 15);
	forward = new THREE.Vector3(0, 0, -1);
	right = new THREE.Vector3(1, 0, 0);
	rotationX = 0;
	rotationY = 0;
	speed = 0.25;

	constructor(camera, inputTracker) {
		this.camera = camera;
		this.inputTracker = inputTracker;
	}

	init() {
		this.camera.position.copy(this.position);
	}

	update() {
		this.updateRotation();

		const velocity = this.getVelocity();

		const newPosition = this.position.clone().add(velocity);
		this.updatePosition(newPosition);
	}

	getVelocity() {
		const velocity = new THREE.Vector3();

		if (this.inputTracker.keysPressed[Keybinds.MoveForward]) {
			velocity.add(this.forward);
		}

		if (this.inputTracker.keysPressed[Keybinds.MoveBackward]) {
			velocity.sub(this.forward);
		}

		if (this.inputTracker.keysPressed[Keybinds.StrafeLeft]) {
			velocity.sub(this.right);
		}

		if (this.inputTracker.keysPressed[Keybinds.StrafeRight]) {
			velocity.add(this.right);
		}

		velocity.multiplyScalar(this.speed);

		return velocity;
	}

	updateRotation() {
		if (this.inputTracker.keysPressed[Keybinds.Up]) {
			this.rotationX -= 0.01;
		}

		if (this.inputTracker.keysPressed[Keybinds.Down]) {
			this.rotationX += 0.01;
		}

		if (this.inputTracker.keysPressed[Keybinds.Left]) {
			this.rotationY += 0.01;
		}

		if (this.inputTracker.keysPressed[Keybinds.Right]) {
			this.rotationY -= 0.01;
		}

		const rotation = new THREE.Euler(this.rotationX, this.rotationY, 0, "XYZ");

		this.forward.set(0, 0, -1);
		this.forward.applyEuler(rotation);

		rotation.set(0, this.rotationY, 0, "XYZ");

		this.right.set(1, 0, 0);
		this.right.applyEuler(rotation);

		this.camera.lookAt(this.forward.clone().add(this.position));
	}

	updatePosition(newPosition) {
		this.position.copy(newPosition);
		this.camera.position.copy(this.position);
	}
}
