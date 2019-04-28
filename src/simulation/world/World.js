import * as THREE from "three";

const Size = 64;
const Unit = 1;

export default class World {
	scene = null;
	groundMesh = null;

	init() {
		this.scene = new THREE.Scene();

		this.groundMesh = this.getGroundMesh();
		this.scene.add(this.groundMesh);
	}

	getGroundMesh() {
		const geometry = new THREE.Geometry();

		let k = 0;
		for (let x = 0; x < Size; x++) {
			for (let y = 0; y < Size; y++) {
				const h00 = this.getHeight(x, y);
				const h10 = this.getHeight(x + 1, y);
				const h01 = this.getHeight(x, y + 1);
				const h11 = this.getHeight(x + 1, y + 1);

				const x0 = Unit * x - Size / 2;
				const y0 = -Unit * y + Size / 2;
				const x1 = Unit * (x + 1) - Size /2;
				const y1 = -Unit * (y + 1) + Size / 2;

				geometry.vertices.push(new THREE.Vector3(x0, h00, y0));
				geometry.vertices.push(new THREE.Vector3(x1, h10, y0));
				geometry.vertices.push(new THREE.Vector3(x0, h01, y1));

				geometry.faces.push(new THREE.Face3(k, k + 1, k + 2));

				geometry.vertices.push(new THREE.Vector3(x1, h10, y0));
				geometry.vertices.push(new THREE.Vector3(x1, h11, y1));
				geometry.vertices.push(new THREE.Vector3(x0, h01, y1));

				geometry.faces.push(new THREE.Face3(k + 3, k + 4, k + 5));

				k += 6;
			}
		}

		geometry.computeFaceNormals();

		const material = new THREE.MeshNormalMaterial();
		const mesh = new THREE.Mesh(geometry, material);

		return mesh;
	}

	getHeight(x, y) {
		if (x === 0 || y === 0 || x === Size || y === Size) {
			return 0;
		}

		return 10 + 10 * Math.sin(Math.PI / 180 * (x / Size * 360))
			* Math.cos(Math.PI / 180 * (y / Size * 360));
	}
}
