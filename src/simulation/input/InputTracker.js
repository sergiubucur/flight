export default class InputTracker {
	keysPressed = {};

	init() {
		document.addEventListener("keydown", (e) => {
			this.keysPressed[e.keyCode] = true;
		});

		document.addEventListener("keyup", (e) => {
			this.keysPressed[e.keyCode] = false;
		});
	}
}
