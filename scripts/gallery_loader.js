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

const loadGalleries = async() => {
	const galleries = getElements(".gallery");
	//
	for (const gallery of galleries) {
		const gallerySrc = gallery.getAttribute("id");
		const galleryEntries = await loadJson(`assets/${gallerySrc}.json`);
		//
		const calculatedGallery = window.getComputedStyle(gallery);
		const galleryColumnCount = calculatedGallery.getPropertyValue("grid-template-columns").split(" ").length;
		const galleryResizeRowIndex = Math.floor(galleryEntries.length / galleryColumnCount);
		//
		const translateString = calculateTranslateString(galleryColumnCount, galleryEntries.length);
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
			if ((i / galleryColumnCount) >= galleryResizeRowIndex) baseDiv.style = translateString;
			//
			gallery.appendChild(baseDiv);
		}
	}
};

document.addEventListener("DOMContentLoaded", loadGalleries);