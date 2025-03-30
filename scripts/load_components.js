"use strict";

// Stolen from classmate's work.
// I was helping our instructor with getting it to work in their workspace.

const getElement = (selector) => document.querySelector(selector);
const getElements = (selector) => document.querySelectorAll(selector);

const replaceElement = (from, to) => {
	try {
		from.parentNode.replaceChild(to,from);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

const includeHTML = (element) => {
	const filePath = element.getAttribute("src");
	fetch(filePath)
		.then(response => response.text())
		.then(data => { element.innerHTML = data; })
		.catch(error => console.error(`Error loading '${filePath}': `, error));
	if (element.children.length === 0) {
		console.log("No children.");
		return;
	}
	console.log(element, element.children, element.innerHTML);
	const firstChild = element.children[0];
	replaceElement(element, firstChild);
};

document.addEventListener("DOMContentLoaded", () => {
	const includes = getElements("include");
	for (const include of includes) {
		includeHTML(include);
		include.textContent.replaceAll(/\w*/g,"");
	}
});