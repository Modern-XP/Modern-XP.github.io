"use strict";

const createElementWithText = (elmType, elmText) => {
	const elm = document.createElement(elmType);
	const text = document.createTextNode(elmText);
	elm.appendChild(text);
	return elm;
};

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency:"USD" });

const formatPercentage = number => Math.abs(number).toLocaleString("en-US", { maximumFractionDigits: 0 }) + `% ${number > 0 ? "ON" : "OFF"}`;

const addPrices = () => {
	const priceElms = getElements(".price");
	for (const priceElm of priceElms) {
		const basePrice = parseFloat(priceElm.getAttribute("base_price"));
		if (isNaN(basePrice)) continue;
		const salePrice = parseFloat(priceElm.getAttribute("sale_price"));
		const salePercentage = ((salePrice - basePrice) / basePrice) * 100;
		//
		const originalPriceSpan = createElementWithText("div", USD.format(basePrice));
		const salePriceSpan = createElementWithText("div", USD.format(salePrice));
		const saleSpan = createElementWithText("div", formatPercentage(salePercentage));
		//
		originalPriceSpan.setAttribute("class", "base_price");
		salePriceSpan.setAttribute("class", "sale_price");
		saleSpan.setAttribute("class", "sale_amount");
		//
		priceElm.appendChild(originalPriceSpan);
		if (isNaN(salePrice)) continue;
		priceElm.appendChild(salePriceSpan);
		priceElm.appendChild(saleSpan);
	}
};

document.addEventListener("DOMContentLoaded", addPrices);