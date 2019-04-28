export default class InputTracker {
	logger = null;
	keysPressed = {};
	movementX = 0;
	movementY = 0;
	usePointerLock = false;

	constructor(logger) {
		this.logger = logger;
	}

	init() {
		document.addEventListener("contextmenu", (e) => {
			e.preventDefault();
		});

		document.addEventListener("keydown", (e) => {
			this.keysPressed[e.keyCode] = true;
		});

		document.addEventListener("keyup", (e) => {
			this.keysPressed[e.keyCode] = false;
		});

		if (this.usePointerLock) {
			document.addEventListener("mousedown", (e) => {
				if (e.button === 2 && document.pointerLockElement === null) {
					document.body.requestPointerLock();
				}
			});

			document.addEventListener("mousemove", (e) => {
				if (document.pointerLockElement === null) {
					return;
				}

				this.movementX = e.movementX;
				this.movementY = e.movementY;
			});
		}
	}

	resetMovement() {
		this.movementX = 0;
		this.movementY = 0;
	}

	update() {
		if (this.usePointerLock) {
			if (document.pointerLockElement === null) {
				this.logger.log();
				this.logger.log("right-click for pointer lock");
			}
		}

		this.resetMovement();
	}
}
