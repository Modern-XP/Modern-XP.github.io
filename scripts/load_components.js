"use strict";

// Stolen from classmate's work.
// I was helping our instructor with getting it to work in their workspace.

const getElement = (selector) => document.querySelector(selector);
const getElements = (selector) => document.querySelectorAll(selector);

const rgxWhitespace = /\s*/g;
const rgxParams = /\$\{param\.[\w]+\}/ig;

const getParamRegex = (name) => new RegExp(`\\$\\{param\\.${name}\\}`,'i');

const replaceElement = (from, to) => {
	try { from.parentNode.replaceChild(to, from); }
	catch (error) {
		console.error(error);
		throw error;
	}
};

const filterChildren = (element, selector) => [...element.children].filter(elm => elm.matches(selector));

const includeHTML = (element) => {
	//? Get param tags within include element.
	const paramTags = filterChildren(element, "param");
	//? Create an object out of the params' names and values.
	//TODO: Might look into shorter way of achieving this for later indexing.
	const params = Object.fromEntries(paramTags.map((elm) => [elm.getAttribute("name"), elm.value]));
	//
	const filePath = element.getAttribute("src");
	fetch(filePath)
		.then(response => response.text())
		.then(data => {
			element.innerHTML = data;
			//? Replace params with values if they exist.
			Object.keys(params).forEach( key => {
				const rgxTest = getParamRegex(key);
				if (!rgxTest.test(element.innerHTML)) return;
				element.innerHTML = element.innerHTML.replace(rgxTest,params[key]);
			});
			//? Add includes recursively.
			const firstChild = element.children[0];
			const subIncludes = filterChildren(firstChild, "include");
			if (subIncludes) { includeMain(subIncludes, filePath); } // Make async to not be slow.
			//? Replace the include element with the file contents.
			//TODO: currently can only use one contained element in files.
			//TODO: will look for solution to include whole file contents later.
			replaceElement(element, firstChild);
		})
		.catch(error => console.error(`Error loading '${filePath}': `, error));
};

const includeMain = (includes, filePath) => {
	for (const include of includes) {
		if (include.getAttribute("src") == filePath) continue;
		includeHTML(include);
	}
};

document.addEventListener("DOMContentLoaded", () => {
	const includes = getElements("include");
	includeMain(includes)
});