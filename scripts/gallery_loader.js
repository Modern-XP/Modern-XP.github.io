"use strict";

const loadJson = async filePath => (await fetch(filePath)).json();

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
	}
};

document.addEventListener("DOMContentLoaded", loadGalleries);