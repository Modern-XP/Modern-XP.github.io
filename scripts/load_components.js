"use strict";

// Stolen from classmate's work.
// I was helping our instructor with getting it to work in their workspace.

const getElement = (selector) => document.querySelector(selector);
const getElements = (selector) => document.querySelectorAll(selector);

const rgxWhitespace = /\s*/g;
const rgxEscapeSection = /\$\{(?<code>.*)\}/g;
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
const paramToObject = paramElements => Object.fromEntries(paramElements.map(elm => [elm.getAttribute("name"), elm.value]));

const processIncludeData = (elm, data) => {
	//? Get param tags within include element.
	//? Create an object out of the params' names and values.
	//TODO: Might look into better ways of achieving this for improved indexing.
	const params = paramToObject(filterChildren(elm, "param"));
	//? Replace params with values if they exist.
	Object.keys(params).forEach(key => {
		const rgxTest = getParamRegex(key);
		if (!rgxTest.test(data)) return;
		data = data.replace(rgxTest,params[key]);
	});
	//? Replace the include element with the file contents.
	//TODO: currently can only use one contained element in files.
	//TODO: will look for solution to include whole file contents later.
	elm.innerHTML = data;
	const firstChild = elm.children[0];
	replaceElement(elm, firstChild);
	//? Send child includes to be worked on asynchronously.
	return filterChildren(firstChild, "include");
};

const includeHTML = (element, fileTrace) => {
	const filePath = element.getAttribute("src");
	fetch(filePath)
		.then(response => response.text())
		.then(data => processIncludeData(element, data))
		.then(children => includeMain(children, fileTrace))
		.catch(error => console.error(`Error loading '${filePath}': `, error));
};

const includeMain = (includes, fileTrace) => {
	//? Don't need to put this here, but if falsy, return immediately.
	if (!includes) return;
	//? Replace looped includes with div that says 'Looped include.'.
	for (const include of includes) {
		//? Skip already included file to prevent infinite recursion.
		const filePath = include.getAttribute("src");
		if (fileTrace.includes(filePath)) continue;
		//? Create a copy of the fileTrace with the next filePath to use as a trace.
		//? The copy allows different branches to use the same include without stepping on each other.
		includeHTML(include, [...fileTrace, filePath]);
	}
};

document.addEventListener("DOMContentLoaded", () => {
	const includes = getElements("include");
	//? Get current page uri to add to fileTrace.
	let uri = window.location.pathname.substring(1);
	if (!uri) uri = "index.html";
	includeMain(includes, [uri])
});