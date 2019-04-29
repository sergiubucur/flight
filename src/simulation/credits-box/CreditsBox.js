export default class CreditsBox {
	init() {
		this.domElement = document.createElement("div");
		this.domElement.style.color = "#fff";
		this.domElement.style.fontFamily = "Arial, Helvetica, sans-serif";
		this.domElement.style.fontSize = "16px";
		this.domElement.style.textAlign = "right";
		this.domElement.style.position = "absolute";
		this.domElement.style.right = "10px";
		this.domElement.style.bottom = "20px";
		this.domElement.style.zIndex = 100;
		this.domElement.style.opacity = 0.4;

		this.domElement.innerHTML = `
			<h2 style="margin-bottom: 5px">Flight</h2>
			<div>Sergiu-Valentin Bucur, 2019<div>
		`;

		document.body.appendChild(this.domElement);
	}
}
