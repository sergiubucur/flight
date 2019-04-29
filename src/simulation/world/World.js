import * as THREE from "three";

import Constants from "../Constants";

const DirLightVector1 = new THREE.Vector3(-1.33, -0.46, 1.2);
const DirLightVector2 = new THREE.Vector3(1.77, 0.78, -1.45);

const WorldHalfSize = Constants.WorldSize / 2;

export default class World {
	assetLibrary = null;
	scene = null;
	dirLight1 = null;
	dirLight2 = null;
	groundMesh = null;
	heightmap = null;
	lightRotation = 0;

	constructor(assetLibrary, logger) {
		this.assetLibrary = assetLibrary;
		this.logger = logger;
	}

	init() {
		this.initHeightmap();

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x133351);
		this.scene.fog = new THREE.Fog(0x133351, 64, 128);

		this.dirLight1 = new THREE.DirectionalLight(0xfff0e0);
		this.dirLight1.position.copy(DirLightVector1).normalize();
		this.scene.add(this.dirLight1);

		this.dirLight2 = new THREE.DirectionalLight(0x133351);
		this.dirLight2.position.copy(DirLightVector2).normalize();
		this.scene.add(this.dirLight2);

		this.groundMesh = this.getGroundMesh();
		this.scene.add(this.groundMesh);

		for (let x = -1; x < 2; x++) {
			for (let y = -1; y < 2; y++) {
				if (x === 0 && y === 0) {
					continue;
				}

				const mesh = this.groundMesh.clone();
				mesh.position.set(x * Constants.WorldSize, 0, y * Constants.WorldSize);

				this.scene.add(mesh);
			}
		}

		// for (let x = -4; x < 5; x++) {
		// 	for (let y = -4; y < 5; y++) {
		// 		if (x !== -4 && x !== 4 && y !== -4 && y !== 4) {
		// 			continue;
		// 		}

		// 		const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial());
		// 		mesh.position.set(x * 16, 17, y * 16);

		// 		this.scene.add(mesh);
		// 	}
		// }
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

				const x0 = Constants.WorldUnit * x - WorldHalfSize;
				const y0 = -Constants.WorldUnit * y + WorldHalfSize;
				const x1 = Constants.WorldUnit * (x + 1) - WorldHalfSize;
				const y1 = -Constants.WorldUnit * (y + 1) + WorldHalfSize;

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
		if (x === Constants.WorldSize) {
			x = 0;
		}

		if (y === Constants.WorldSize) {
			y = 0;
		}

		return this.heightmap[Constants.WorldSize - y][x];
	}

	getInterpolatedHeight(position) {
		const x = position.x + WorldHalfSize;
		const y = position.z + WorldHalfSize;

		const x0 = Math.floor(x);
		const y0 = Math.floor(y);

		const h00 = this.heightmap[y0][x0];
		const h01 = this.heightmap[y0][x0 + 1];
		const h11 = this.heightmap[y0 + 1][x0 + 1];
		const h10 = this.heightmap[y0 + 1][x0];

		const dx = x - x0;
		const dy = y - y0;

		const a1 = (1 - dx) * h00 + dx * h01;
		const a2 = (1 - dx) * h10 + dx * h11;

		return (1 - dy) * a1 + dy * a2;
	}
}
