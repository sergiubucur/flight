import * as THREE from "three";

import Keybinds from "../input/Keybinds";
import Constants from "../Constants";

const WorldHalfSize = Constants.WorldSize / 2;

export default class Spaceship {
	logger = null;
	inputTracker = null;
	camera = null;
	mesh = null;
	position = null;
	velocity = 0.05;
	acceleration = 0;
	rotationX = 0;
	rotationY = 0;
	cameraOffset = new THREE.Vector3(0, 2.5, 5);

	constructor(logger, inputTracker, camera) {
		this.logger = logger;
		this.inputTracker = inputTracker;
		this.camera = camera;
	}

	init() {
		this.position = new THREE.Vector3(0, 10, 0);
		this.updateCameraPosition();

		this.mesh = this.getMesh();
		this.mesh.position.copy(this.position);
	}

	getMesh() {
		const geometry = new THREE.ConeBufferGeometry();
		geometry.rotateX(THREE.Math.degToRad(-90));
		geometry.scale(1, 0.1, 2);

		const material = new THREE.MeshPhongMaterial();
		const mesh = new THREE.Mesh(geometry, material);

		return mesh;
	}

	updateCameraPosition() {
		const rotation = new THREE.Euler(THREE.Math.degToRad(this.rotationX), THREE.Math.degToRad(this.rotationY), 0, "ZYX");
		const offset = this.cameraOffset.clone().applyEuler(rotation);

		this.camera.position.copy(this.position).add(offset);
		this.camera.lookAt(this.position);
	}

	update() {
		this.updateRotation();

		const rotation = new THREE.Euler(THREE.Math.degToRad(this.rotationX), THREE.Math.degToRad(this.rotationY), 0, "ZYX");

		if (this.inputTracker.keysPressed[Keybinds.MoveForward]) {
			this.acceleration += 0.005;
		}

		this.velocity += this.acceleration;
		this.velocity *= 0.99;
		this.velocity = THREE.Math.clamp(this.velocity, 0.05, Infinity);
		this.acceleration *= 0.1;

		const velocity = new THREE.Vector3(0, 0, -this.velocity).applyEuler(rotation);

		const newPosition = this.position.clone().add(velocity);
		this.updatePosition(newPosition);

		this.logger.logVector3("position", this.position);
		this.logger.logNumber("rotationX", this.rotationX);
		this.logger.logNumber("rotationY", this.rotationY);
		this.logger.logNumber("velocity", this.velocity);
		this.logger.logNumber("acceleration", this.acceleration);
	}

	updateRotation() {
		const turnSpeed = this.velocity * 1.5;

		if (this.inputTracker.keysPressed[Keybinds.Up]) {
			this.rotationX -= turnSpeed * 0.5;
		}

		if (this.inputTracker.keysPressed[Keybinds.Down]) {
			this.rotationX += turnSpeed * 0.5;
		}

		if (this.inputTracker.keysPressed[Keybinds.Left]) {
			this.rotationY += turnSpeed;
		}

		if (this.inputTracker.keysPressed[Keybinds.Right]) {
			this.rotationY -= turnSpeed;
		}

		this.rotationX = THREE.Math.clamp(this.rotationX, -30, 30);
	}

	updatePosition(newPosition) {
		newPosition.x = THREE.Math.clamp(newPosition.x, -WorldHalfSize, WorldHalfSize);
		newPosition.y = THREE.Math.clamp(newPosition.y, -WorldHalfSize, WorldHalfSize);
		newPosition.z = THREE.Math.clamp(newPosition.z, -WorldHalfSize, WorldHalfSize);

		this.position.copy(newPosition);
		this.mesh.position.copy(this.position);
		this.mesh.rotation.set(THREE.Math.degToRad(this.rotationX), THREE.Math.degToRad(this.rotationY), 0, "ZYX");
		this.updateCameraPosition();
	}
}
