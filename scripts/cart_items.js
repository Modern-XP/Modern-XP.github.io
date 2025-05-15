"use strict";

const loadJson = async(path) => await (await fetch(path)).json();

const getCart = () => JSON.parse(sessionStorage.cart);
const setCart = (newCart) => sessionStorage.cart = JSON.stringify(newCart);

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
		totalPrice += (game.sale_price ?? game.base_price) * item.count;
	}
	getElement("#total").textContent = USD.format(totalPrice) + " + tax";
};

const removeFromCart = (listItem, itemId) => {
	//? Get cart
	const cart = JSON.parse(sessionStorage.cart);
	const cartItemIndex = cart.findIndex(i => i.id === itemId);
	//? Remove empty entry from cart.
	listItem.remove();
	cart.splice(cartItemIndex, 1);
	updateCart(cart.length === 0);
	//? Save changes.
	sessionStorage.cart = JSON.stringify(cart);
};

const changeItemCount = (counter, item) => {
	const cart = getCart();
	//
	const index = cart.map(i => i.id).indexOf(item.id);
	cart[index].count = counter.value;
	//
	setCart(cart);
	updateCart(cart.length === 0);
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

const buildListItem = (game, item) => {
	const listItem = document.createElement("li");
	const gameArt = document.createElement("img");
	const gameTitle = document.createElement("h2");
	const gamePrice = document.createElement("div");
	const counter = document.createElement("input");
	//
	const gameTC = document.createElement("div");
	//
	gameArt.src = game.art;
	gameTitle.textContent = game.title;
	//
	gamePrice.setAttribute("class", "price");
	gamePrice.setAttribute("base_price", game.base_price);
	gamePrice.setAttribute("sale_price", game.sale_price);
	counter.setAttribute("type","number");
	counter.addEventListener("change", () => changeItemCount(counter, item));
	counter.value = item.count;
	counter.min = 1;
	counter.max = 999;
	counter.step = 1;
	//
	buildPriceElement(gamePrice);
	//
	gameTC.className = "cart_tc";
	//
	gameTC.appendChild(gameTitle);
	gameTC.appendChild(counter)
	//
	listItem.appendChild(gameArt);
	listItem.appendChild(gameTC);
	listItem.appendChild(gamePrice);
	//
	const xButton = buildXButton(() => removeFromCart(listItem, item.id));
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
		const listItem = buildListItem(game, item);
		list.appendChild(listItem);
		totalPrice += (game.sale_price ?? game.base_price) * item.count;
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