import * as THREE from "three";

import Keybinds from "../input/Keybinds";
import Constants from "../Constants";

const WorldHalfSize = Constants.WorldSize / 2;
const CameraOffset = new THREE.Vector3(0, 2.5, 5);
const SpaceshipColor = new THREE.Color(0x0080ff);
const RotationOffsetMax = 15;

export default class Spaceship {
	camera = null;
	inputTracker = null;
	logger = null;
	world = null;

	mesh = null;
	pointLight = null;
	lightCounter = 0;
	position = new THREE.Vector3(0, 0, 0);
	velocity = 0;
	acceleration = 0;
	rotationX = 0;
	rotationY = 0;
	meshRotationXOffset = 0;
	meshRotationZOffset = 0;

	constructor(camera, inputTracker, logger, world) {
		this.camera = camera;
		this.inputTracker = inputTracker;
		this.logger = logger;
		this.world = world;
	}

	init() {
		this.mesh = this.getMesh();

		this.pointLight = new THREE.PointLight(SpaceshipColor, 1, 5);
		this.world.scene.add(this.pointLight);

		this.reset();
	}

	reset() {
		this.velocity = 0.05;
		this.acceleration = 0;
		this.rotationX = 0;
		this.rotationY = 0;
		this.meshRotationXOffset = 0;
		this.meshRotationZOffset = 0;

		this.updatePosition(new THREE.Vector3(0, 10, 0));
	}

	getMesh() {
		const geometry = new THREE.ConeBufferGeometry();
		geometry.rotateX(THREE.Math.degToRad(-90));
		geometry.scale(0.75, 0.1, 2);

		const material = new THREE.MeshPhongMaterial();
		material.emissive.set(SpaceshipColor);
		material.emissiveIntensity = 0.1;

		const mesh = new THREE.Mesh(geometry, material);

		return mesh;
	}

	updateCameraPosition() {
		const rotation = new THREE.Euler(THREE.Math.degToRad(this.rotationX), THREE.Math.degToRad(this.rotationY), 0, "ZYX");
		const offset = CameraOffset.clone().applyEuler(rotation);

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

		this.updateLight();

		this.logger.logVector3("position", this.position);
		this.logger.logNumber("rotationX", this.rotationX);
		this.logger.logNumber("rotationY", this.rotationY);
		this.logger.logNumber("velocity", this.velocity);
		this.logger.logNumber("acceleration", this.acceleration);
	}

	updateLight() {
		this.lightCounter += 0.1;

		this.pointLight.intensity = 0.5 + 0.5 * Math.sin(this.lightCounter);
	}

	updateRotation() {
		const turnSpeed = this.velocity * 2;

		if (this.inputTracker.keysPressed[Keybinds.Up]) {
			this.rotationX -= turnSpeed * 0.5;
			this.meshRotationXOffset -= 0.1;
		}

		if (this.inputTracker.keysPressed[Keybinds.Down]) {
			this.rotationX += turnSpeed * 0.5;
			this.meshRotationXOffset += 0.1;
		}

		if (this.inputTracker.keysPressed[Keybinds.Left]) {
			this.rotationY += turnSpeed;
			this.meshRotationZOffset += 0.1;
		}

		if (this.inputTracker.keysPressed[Keybinds.Right]) {
			this.rotationY -= turnSpeed;
			this.meshRotationZOffset -= 0.1;
		}

		this.rotationX = THREE.Math.clamp(this.rotationX, -30, 30);

		this.meshRotationXOffset *= 0.99;
		this.meshRotationZOffset *= 0.99;
		this.meshRotationXOffset = THREE.Math.clamp(this.meshRotationXOffset, -RotationOffsetMax, RotationOffsetMax);
		this.meshRotationZOffset = THREE.Math.clamp(this.meshRotationZOffset, -RotationOffsetMax, RotationOffsetMax);
	}

	updatePosition(newPosition) {
		if (newPosition.x < -WorldHalfSize || newPosition.x > WorldHalfSize - 0.01
			|| newPosition.z < -WorldHalfSize || newPosition.z > WorldHalfSize - 0.01) {
			this.reset();
			return;
		}

		const terrainHeight = this.world.getInterpolatedHeight(newPosition);
		if (newPosition.y <= terrainHeight) {
			this.reset();
			return;
		}

		this.position.copy(newPosition);
		this.mesh.position.copy(this.position);

		this.mesh.rotation.set(
			THREE.Math.degToRad(this.rotationX + this.meshRotationXOffset),
			THREE.Math.degToRad(this.rotationY),
			THREE.Math.degToRad(this.meshRotationZOffset * 2),
			"YXZ");

		this.pointLight.position.copy(this.position);
		this.updateCameraPosition();
	}
}
