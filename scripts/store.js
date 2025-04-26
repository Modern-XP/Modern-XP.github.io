"use strict";

const initializeCart = () => {
	if (!sessionStorage.getItem("cart"))
		sessionStorage.setItem("cart", "[]");
};

const addToCart = (itemId) => {
	let cart = JSON.parse(sessionStorage.cart);
	let cartItem = cart.find(i => i.id === itemId);
	if (!cartItem) {
		cartItem = { id:itemId, count:0 };
		cart.push(cartItem);
	}
	++cartItem.count;
	sessionStorage.cart = JSON.stringify(cart);
};

const cart = (evt) => {
	evt.preventDefault()
	addToCart(getElement("input[name=item_id]").value);
	getElement("#cart_dialog").showModal();
};

const goToCart = () => getElement("form").submit();
const closeDialog = () => getElement("#cart_dialog").close();

document.addEventListener("DOMContentLoaded", (evt) => {
	initializeCart();
	getElement("form").addEventListener("submit", cart);
	getElement("#dialog_cart").addEventListener("click", goToCart)
	getElement("#dialog_close").addEventListener("click", closeDialog);
});