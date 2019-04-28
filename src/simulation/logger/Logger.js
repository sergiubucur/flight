export default class Logger {
	domElement = null;
	logItems = [];

	init() {
		this.domElement = document.createElement("div");
		this.domElement.style.color = "#fff";
		this.domElement.style.fontFamily = "Arial, Helvetica, sans-serif";
		this.domElement.style.fontSize = "22px";
		this.domElement.style.position = "absolute";
		this.domElement.style.left = "10px";
		this.domElement.style.top = "10px";
		this.domElement.style.zIndex = 100;

		document.body.appendChild(this.domElement);
	}

	update() {
		this.domElement.innerHTML = this.logItems.join("<br/>");

		this.logItems.length = 0;
	}

	log(message) {
		this.logItems.push(message);
	}

	logNumber(name, number, digits = 2) {
		this.logItems.push(`${name}: ${number.toFixed(digits)}`);
	}

	logVector3(name, vector3, digits = 2) {
		this.logItems.push(`${name}: ${vector3.x.toFixed(digits)} ${vector3.y.toFixed(digits)} ${vector3.z.toFixed(digits)}`);
	}
}
