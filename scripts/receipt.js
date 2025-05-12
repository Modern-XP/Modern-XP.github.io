"use strict";

const loadJson = async(path) => await (await fetch(path)).json();

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency:"USD" });

const buildReceipt = async() => {
	const games = await loadJson("assets/games.json");
	const receipt = JSON.parse(sessionStorage.receipt);
	//
	const receiptElm = document.createElement("div");
	receiptElm.className = "receipt";
	let subtotal = 0;
	for (let i = 0; i < receipt.length; ++i) {
		const game = games.filter(g => g.id === receipt[i].id)[0];
		const subDiv = document.createElement("div");
		//
		const count = receipt[i].count;
		const price = (game.sale_price ?? game.base_price) * count;
		subtotal += price;
		//
		const text = document.createTextNode(`${game.title} x${count} | ${USD.format(price)}`);
		subDiv.appendChild(text);
		receiptElm.appendChild(subDiv);
	}
	//
	receiptElm.appendChild(document.createElement("hr"));
	const para = document.createElement("p");
	para.appendChild(document.createTextNode(`Subtotal: ${USD.format(subtotal)}`));
	para.appendChild(document.createElement("br"));
	para.appendChild(document.createTextNode(`Tax: ${USD.format(subtotal * 0.05)}`));
	para.appendChild(document.createElement("br"));
	para.appendChild(document.createTextNode(`Total: ${USD.format(subtotal * 1.05)}`));
	receiptElm.appendChild(para);
	return receiptElm;
};

const createReceipt = async() => {
	const receipt = await buildReceipt();
	getElement("main").appendChild(receipt);
};

document.addEventListener("DOMContentLoaded", () => {
	createReceipt();
});
