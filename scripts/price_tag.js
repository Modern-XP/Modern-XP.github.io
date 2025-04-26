"use strict";

const createElementWithText = (elmType, elmText) => {
	const elm = document.createElement(elmType);
	const text = document.createTextNode(elmText);
	elm.appendChild(text);
	return elm;
};

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency:"USD" });

const formatPercentage = number => Math.abs(number).toLocaleString("en-US", { maximumFractionDigits: 0 }) + `% ${number > 0 ? "ON" : "OFF"}`;

const getSaleAmount = (basePrice, salePrice) => ((salePrice - basePrice) / basePrice) * 100;

const buildPriceElement = (priceElement) => {
	const basePrice = parseFloat(priceElement.getAttribute("base_price"));
	const salePrice = parseFloat(priceElement.getAttribute("sale_price"));
	const salePercentage = getSaleAmount(basePrice, salePrice);
	//
	const originalPriceSpan = createElementWithText("div", USD.format(basePrice));
	originalPriceSpan.setAttribute("class", "base_price");
	priceElement.appendChild(originalPriceSpan);
	//
	const salePriceSpan = createElementWithText("div", USD.format(salePrice));
	if (isNaN(salePrice)) return;
	const saleSpan = createElementWithText("div", formatPercentage(salePercentage));
	//
	salePriceSpan.setAttribute("class", "sale_price");
	saleSpan.setAttribute("class", "sale_amount");
	//
	priceElement.appendChild(salePriceSpan);
	priceElement.appendChild(saleSpan);
};

const addPrices = () => {
	const priceElms = getElements(".price");
	for (const priceElm of priceElms) {
		const basePrice = parseFloat(priceElm.getAttribute("base_price"));
		if (isNaN(basePrice)) continue;
		buildPriceElement(priceElm);
	}
};

document.addEventListener("DOMContentLoaded", addPrices);