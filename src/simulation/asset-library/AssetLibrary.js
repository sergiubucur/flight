import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

export default class AssetLibrary {
	assets = {
		"heightmap": { type: "texture", path: "assets/textures/heightmap.png" },
		"spaceship": { type: "mesh", path: "assets/meshes/spaceship.obj", materialPath: "assets/meshes/spaceship.mtl" }
	};

	textures = {};
	meshes = {};

	assetsLoaded = 0;
	assetCount = 0;
	resolve = null;

	init() {
		return new Promise(resolve => {
			this.resolve = resolve;
			this.assetCount = Object.keys(this.assets).length;

			Object.keys(this.assets).forEach(name => {
				const asset = this.assets[name];

				switch (asset.type) {
					case "texture":
						this.loadTexture(name, asset);
						break;

					case "mesh":
						this.loadMesh(name, asset);
						break;

					default:
						throw new Error("invalid asset type");
				}
			});
		});
	}

	loadTexture(name, asset) {
		const texture = new THREE.TextureLoader().load(asset.path, () => {
			this.textures[name] = texture;
			this.onAssetLoaded();
		});
	}

	loadMesh(name, asset) {
		new MTLLoader().load(asset.materialPath, (materials) => {
			materials.preload();

			new OBJLoader().setMaterials(materials).load(asset.path, (mesh) => {
				this.meshes[name] = mesh;
				this.onAssetLoaded();
			});
		});
	}

	onAssetLoaded() {
		this.assetsLoaded++;

		if (this.assetsLoaded === this.assetCount) {
			this.resolve();
			this.resolve = null;
		}
	}
}
