import * as THREE from "three";

import Constants from "../Constants";

const DirLightVector1 = new THREE.Vector3(-1.33, -0.46, 1.2);
const DirLightVector2 = new THREE.Vector3(1.77, 0.78, -1.45);

export default class World {
	assetLibrary = null;
	scene = null;
	dirLight1 = null;
	dirLight2 = null;
	groundMesh = null;
	heightmap = null;
	lightRotation = 0;

	constructor(assetLibrary) {
		this.assetLibrary = assetLibrary;
	}

	init() {
		this.initHeightmap();

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x133351);

		this.dirLight1 = new THREE.DirectionalLight(0xfff0e0);
		this.dirLight1.position.copy(DirLightVector1).normalize();
		this.scene.add(this.dirLight1);

		this.dirLight2 = new THREE.DirectionalLight(0x133351);
		this.dirLight2.position.copy(DirLightVector2).normalize();
		this.scene.add(this.dirLight2);

		this.groundMesh = this.getGroundMesh();
		this.scene.add(this.groundMesh);
	}

	update() {
		this.lightRotation += 0.0025;

		const rotation = new THREE.Euler(0, this.lightRotation, 0, "XYZ");

		this.dirLight1.position.copy(DirLightVector1).normalize().applyEuler(rotation);
		this.dirLight2.position.copy(DirLightVector2).normalize().applyEuler(rotation);
	}

	getGroundMesh() {
		const geometry = new THREE.Geometry();
		geometry.faceVertexUvs = [[]];

		let k = 0;
		for (let x = 0; x < Constants.WorldSize; x++) {
			for (let y = 0; y < Constants.WorldSize; y++) {
				const h00 = this.getHeight(x, y);
				const h10 = this.getHeight(x + 1, y);
				const h01 = this.getHeight(x, y + 1);
				const h11 = this.getHeight(x + 1, y + 1);

				const x0 = Constants.WorldUnit * x - Constants.WorldSize / 2;
				const y0 = -Constants.WorldUnit * y + Constants.WorldSize / 2;
				const x1 = Constants.WorldUnit * (x + 1) - Constants.WorldSize / 2;
				const y1 = -Constants.WorldUnit * (y + 1) + Constants.WorldSize / 2;

				geometry.vertices.push(new THREE.Vector3(x0, h00, y0));
				geometry.vertices.push(new THREE.Vector3(x1, h10, y0));
				geometry.vertices.push(new THREE.Vector3(x0, h01, y1));

				geometry.faces.push(new THREE.Face3(k, k + 1, k + 2));

				geometry.faceVertexUvs[0].push([
					new THREE.Vector2(0, 0),
					new THREE.Vector2(1, 0),
					new THREE.Vector2(0, 1)
				]);

				geometry.vertices.push(new THREE.Vector3(x1, h10, y0));
				geometry.vertices.push(new THREE.Vector3(x1, h11, y1));
				geometry.vertices.push(new THREE.Vector3(x0, h01, y1));

				geometry.faces.push(new THREE.Face3(k + 3, k + 4, k + 5));

				geometry.faceVertexUvs[0].push([
					new THREE.Vector2(1, 0),
					new THREE.Vector2(1, 1),
					new THREE.Vector2(0, 1)
				]);

				k += 6;
			}
		}

		// geometry.mergeVertices();
		geometry.computeVertexNormals();

		const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);

		const material = new THREE.MeshPhongMaterial();
		material.color = new THREE.Color(0xEDC9AF);

		const mesh = new THREE.Mesh(bufferGeometry, material);

		return mesh;
	}

	initHeightmap() {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		context.drawImage(this.assetLibrary.textures["heightmap"].image, 0, 0);

		const n = Constants.WorldSize + 1;
		const imageData = context.getImageData(0, 0, n, n).data;

		const matrix = [];

		for (let y = 0; y < n; y++) {
			const row = [];

			for (let x = 0; x < n; x++) {
				row.push(imageData[(x + y * n) * 4] / 255 * Constants.WorldMaxHeight);
			}

			matrix.push(row);
		}

		this.heightmap = matrix;
	}

	getHeight(x, y) {
		return this.heightmap[Constants.WorldSize - y][x];
	}
}
