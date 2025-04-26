"use strict";

const writeEmptyCartMessage = () => {
	const paragraph = document.createElement("p");
	paragraph.textContent = "Seems like your cart is empty.";
	getElement("#game_list").appendChild(paragraph);
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
	if (cart[cartItemIndex].count === 0) {
		cart.splice(cartItemIndex, 1);
		//? Write message if the cart is empty.
		if (cart.length === 0) writeEmptyCartMessage();
	}
	//? Save changes.
	sessionStorage.cart = JSON.stringify(cart);
};

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
	const tempDiv = document.createElement("div");
	tempDiv.textContent = "x";
	tempDiv.style = "font-size: 32px; font-weight: bold; cursor: pointer;";
	tempDiv.addEventListener("click", () => removeFromCart(listItem, itemId));
	listItem.appendChild(tempDiv);
	//
	return listItem;
};

const main = async() => {
	const list = getElement("#game_list");
	const games = await (await fetch("assets/games.json")).json();
	//
	if (!sessionStorage.cart || sessionStorage.cart === "[]") {
		writeEmptyCartMessage();
		return;
	}
	//
	const cart = JSON.parse(sessionStorage.cart);
	//
	for (const item of cart) {
		if (!((games.map(g => g.id)).includes(item.id))) continue;
		//
		const game = games.filter(g => g.id == item.id)[0];
		//
		for (let i = 0; i < item.count; ++i) {
			const listItem = buildListItem(game, item.id);
			list.appendChild(listItem);
		}
	}
	//
	getElement("#game_list script").remove();
};

main();