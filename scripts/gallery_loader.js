"use strict";

const loadJson = async filePath => (await fetch(filePath)).json();

const calculateTranslateString = (galleryColumnCount, entryCount) => {
	const remainder = entryCount % galleryColumnCount;
	//
	const halfWidth = (galleryColumnCount - 1) / 2;
	const offsetMultiplier = 1 - ((remainder - 1) / Math.max(1,galleryColumnCount - 1));
	//
	return `translate: calc((100% + 2ch) * ${halfWidth} * ${offsetMultiplier}) 0;`;
};

const recalcGallery = (gallery) => {
	const calcGallery = window.getComputedStyle(gallery);
	const colCount = calcGallery.getPropertyValue("grid-template-columns").split(' ').length;
	//? Do nothing if no change happened.
	if (gallery.getAttribute("column_count") == colCount) return;
	//
	const offsetIndex = gallery.children.length - (gallery.children.length % colCount);
	const translateString = calculateTranslateString(colCount, gallery.children.length);
	//
	for (let i = 0; i < gallery.children.length; ++i) {
		gallery.children[i].style = i < offsetIndex ? '' : translateString;
	}
	//? Update column_count to new value.
	gallery.setAttribute("column_count", colCount);
};

const loadGalleries = async() => {
	const galleries = getElements(".gallery");
	//
	for (const gallery of galleries) {
		const gallerySrc = gallery.getAttribute("id");
		const galleryEntries = await loadJson(`assets/${gallerySrc}.json`);
		//
		for (const i in galleryEntries) {
			const entry = galleryEntries[i]
			//
			const baseDiv = document.createElement("div");
			const img = document.createElement("img");
			const caption = document.createElement("label");
			//
			img.id = entry.id;
			img.src = entry.image_link;
			img.alt = entry.alt_text;
			caption.for = entry.id;
			caption.textContent = entry.caption;
			//
			baseDiv.appendChild(img);
			baseDiv.appendChild(caption);
			//
			gallery.appendChild(baseDiv);
		}
		//
		const calculatedGallery = window.getComputedStyle(gallery);
		const galleryColumnCount = calculatedGallery.getPropertyValue("grid-template-columns").split(" ").length;
		const translateString = calculateTranslateString(galleryColumnCount, galleryEntries.length);
		//
		const offsetIndex = gallery.children.length - (gallery.children.length % galleryColumnCount);
		for (let i = offsetIndex; i < gallery.children.length; ++i) {
			gallery.children[i].style = translateString;
		}
		gallery.setAttribute("column_count", galleryColumnCount);
		window.addEventListener("resize", () => recalcGallery(gallery));
	}
};

document.addEventListener("DOMContentLoaded", loadGalleries);