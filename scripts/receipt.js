"use strict";

const loadJson = async(path) => await (await fetch(path)).json();

const buildReceipt = async() => {
	const div1 = document.createElement("div");
	div1.classList = "receipt";
	for (let i = 0; i < 10; ++i) {
		const subDiv = document.createElement("div");
		const text = document.createTextNode(`Item ${i}`);
		subDiv.appendChild(text);
		div1.appendChild(subDiv);
	}
	div1.appendChild(document.createElement("hr"))
	const para = document.createElement("p")
	para.appendChild(document.createTextNode("Your total is 1,000,000,000 doubloons."))
	div1.appendChild(para);
	return div1;
};

const createReceipt = async() => {
	const receipt = await buildReceipt();
	getElement("main").appendChild(receipt);
};

document.addEventListener("DOMContentLoaded", () => {
	createReceipt();
});
