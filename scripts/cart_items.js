"use strict";

const loadJson = async(path) => await (await fetch(path)).json();

const displayEmptyCartMsg = () => {
	getElement("#empty_cart_message").style = "display:block;";
	getElement("#store_tag").style = "display:none;";
}

const updateCart = async(isCartEmpty = false) => {
	if (isCartEmpty) { displayEmptyCartMsg(); return; }
	//
	const games = await loadJson("assets/games.json");
	const cart = JSON.parse(sessionStorage.cart);
	let totalPrice = 0;
	//
	for (const item of cart) {
		if (!((games.map(g => g.id)).includes(item.id))) continue;
		//
		const game = games.filter(g => g.id == item.id)[0];
		//
		for (let i = 0; i < item.count; ++i) {
			totalPrice += isNaN(game.sale_price) ? game.base_price : game.sale_price;
		}
	}
	getElement("#total").textContent = USD.format(totalPrice) + " + tax";
};

const buildDescription = (game) => {
	const storeDescription = document.createElement("div");
	const gameTitle = document.createElement("h3");
	const gameDescription = document.createElement("p");
	//
	storeDescription.setAttribute("class", "store_description")
	//
	gameTitle.appendChild(document.createTextNode(game.title));
	gameDescription.appendChild(document.createTextNode(game.description));
	//
	storeDescription.appendChild(gameTitle);
	storeDescription.appendChild(gameDescription);
	//
	return storeDescription;
};

const removeFromCart = (listItem, itemId) => {
	listItem.remove();
	//? Get cart
	const cart = JSON.parse(sessionStorage.cart);
	const cartItemIndex = cart.findIndex(i => i.id === itemId);
	//? Modify count.
	--cart[cartItemIndex].count;
	//? Remove empty entry from cart.
	if (cart[cartItemIndex].count === 0) { cart.splice(cartItemIndex, 1); }
	updateCart(cart.length === 0);
	//? Save changes.
	sessionStorage.cart = JSON.stringify(cart);
};

const buildXButton = (onClick) => {
	const xElm = document.createElement("div");
	xElm.className = "x_button";
	xElm.tabIndex = 0;
	xElm.addEventListener("click", onClick);
	//
	const xWrapper = document.createElement("div");
	xWrapper.className = "x_wrapper";
	xWrapper.appendChild(xElm);
	//
	return xWrapper;
}

const buildListItem = (game, itemId) => {
	const listItem = document.createElement("li");
	const storeDescription = buildDescription(game);
	const gamePrice = document.createElement("div");
	//
	gamePrice.setAttribute("class", "price");
	gamePrice.setAttribute("base_price", game.base_price);
	gamePrice.setAttribute("sale_price", game.sale_price);
	//
	buildPriceElement(gamePrice);
	//
	listItem.appendChild(storeDescription);
	listItem.appendChild(gamePrice);
	//
	const xButton = buildXButton(() => removeFromCart(listItem, itemId));
	//
	listItem.appendChild(xButton);
	//
	return listItem;
};

const initializeCartList = async() => {
	const list = getElement("#game_list");
	const games = await loadJson("assets/games.json");
	//
	if (!sessionStorage.cart || sessionStorage.cart === "[]") {
		displayEmptyCartMsg();
		return;
	}
	//
	const cart = JSON.parse(sessionStorage.cart);
	let totalPrice = 0;
	//
	for (const item of cart) {
		if (!((games.map(g => g.id)).includes(item.id))) continue;
		//
		const game = games.filter(g => g.id == item.id)[0];
		//
		for (let i = 0; i < item.count; ++i) {
			const listItem = buildListItem(game, item.id);
			list.appendChild(listItem);
			totalPrice += isNaN(game.sale_price) ? game.base_price : game.sale_price;
		}
	}
	getElement("#total").textContent = USD.format(totalPrice) + " + tax";
	//
	const scriptElm = getElement("#game_list script");
	if (scriptElm) scriptElm.remove();
};

const buy = () => {
	sessionStorage.receipt = sessionStorage.cart;
	//? Clear cart.
	sessionStorage.cart = "[]";
};

document.addEventListener("DOMContentLoaded", () => {
	initializeCartList();
	getElement("#buy").addEventListener("click", buy);
});