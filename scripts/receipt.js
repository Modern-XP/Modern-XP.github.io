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
		//
		const count = receipt[i].count;
		const price = (game.sale_price ?? game.base_price) * count;
		subtotal += price;
		//
		const itemInfo = document.createElement("span");
		const priceInfo = document.createElement("span");
		itemInfo.textContent = `${game.title} x${count}`;
		priceInfo.textContent = USD.format(price);
		priceInfo.className = "money right";
		receiptElm.appendChild(itemInfo);
		receiptElm.appendChild(priceInfo);
	}
	//
	const taxAmount = 0.05;
	//
	receiptElm.appendChild(document.createElement("hr"));
	//
	const subtotalElm = document.createElement("span");
	const taxElm = document.createElement("span");
	const totalElm = document.createElement("span");
	const subtotalAmountElm = document.createElement("span");
	const taxAmountElm = document.createElement("span");
	const totalAmountElm = document.createElement("span");
	//
	subtotalAmountElm.className = "money right";
	taxAmountElm.className = "money right";
	totalAmountElm.className = "money right";
	//
	subtotalElm.textContent = "Subtotal:";
	taxElm.textContent = "Tax:";
	totalElm.textContent = "Total:";
	subtotalAmountElm.textContent = USD.format(subtotal);
	taxAmountElm.textContent = USD.format(subtotal * taxAmount);
	totalAmountElm.textContent = USD.format(subtotal * (1 + taxAmount));
	//
	receiptElm.appendChild(subtotalElm);
	receiptElm.appendChild(subtotalAmountElm);
	receiptElm.appendChild(taxElm);
	receiptElm.appendChild(taxAmountElm);
	receiptElm.appendChild(totalElm);
	receiptElm.appendChild(totalAmountElm);
	//
	return receiptElm;
};

const createReceipt = async() => {
	const receipt = await buildReceipt();
	getElement("main").appendChild(receipt);
};

document.addEventListener("DOMContentLoaded", () => {
	createReceipt();
});
