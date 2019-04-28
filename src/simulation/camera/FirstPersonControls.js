import * as THREE from "three";

import Keybinds from "../input/Keybinds";

export default class FirstPersonControls {
	camera = null;
	inputTracker = null;
	logger = null;
	position = new THREE.Vector3(0, 5, 15);
	forward = new THREE.Vector3(0, 0, -1);
	right = new THREE.Vector3(1, 0, 0);
	rotationX = 0;
	rotationY = 0;
	speed = 0.25;
	horizontalSensitivity = 0.125;
	verticalSensitivity = 0.125;

	constructor(camera, inputTracker, logger) {
		this.camera = camera;
		this.inputTracker = inputTracker;
		this.logger = logger;
	}

	init() {
		this.camera.position.copy(this.position);
	}

	update() {
		this.updateRotation();

		const velocity = this.getVelocity();

		const newPosition = this.position.clone().add(velocity);
		this.updatePosition(newPosition);

		this.logger.logVector3("position", this.position);
		this.logger.logVector3("velocity", velocity);
		this.logger.logVector3("forward", this.forward);
		this.logger.logVector3("right", this.right);
		this.logger.logNumber("rotationX", this.rotationX);
		this.logger.logNumber("rotationY", this.rotationY);
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
		this.rotationX -= this.inputTracker.movementY * this.verticalSensitivity;
		this.rotationX = THREE.Math.clamp(this.rotationX, -80, 80);
		this.rotationY -= this.inputTracker.movementX * this.horizontalSensitivity;

		const rotation = new THREE.Euler(THREE.Math.degToRad(this.rotationX), THREE.Math.degToRad(this.rotationY), 0, "ZYX");

		this.forward.set(0, 0, -1);
		this.forward.applyEuler(rotation);

		rotation.set(0, THREE.Math.degToRad(this.rotationY), 0, "ZYX");

		this.right.set(1, 0, 0);
		this.right.applyEuler(rotation);

		this.camera.lookAt(this.position.clone().add(this.forward));
	}

	updatePosition(newPosition) {
		this.position.copy(newPosition);
		this.camera.position.copy(this.position);
	}
}
