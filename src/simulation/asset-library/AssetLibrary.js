import * as THREE from "three";

export default class AssetLibrary {
	assets = {
		"heightmap": { type: "texture", path: "assets/textures/heightmap.png" }
	};

	textures = {};

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
						this.loadTexture(name, asset.path);
						break;

					default:
						break;
				}
			});
		});
	}

	loadTexture(name, path) {
		const texture = new THREE.TextureLoader().load(path, () => {
			this.textures[name] = texture;
			this.onAssetLoaded();
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
