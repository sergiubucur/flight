import * as THREE from "three";

export default class World {
	scene = null;
	groundMesh = null;

	init() {
		this.scene = new THREE.Scene();

		this.groundMesh = this.getGroundMesh();
		this.scene.add(this.groundMesh);
	}

	getGroundMesh() {
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshNormalMaterial();

		const mesh = new THREE.Mesh(geometry, material);
		mesh.scale.set(10, 0.1, 10);

		return mesh;
	}
}
