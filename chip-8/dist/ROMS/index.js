"use strict";
const btn = document.querySelectorAll(".downloads");
btn.forEach((_) => _.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    import(`./dist/ROMS/${_.getAttribute("moduleName")}.js`)
        .then((module) => {
        const downloadFn = module.download;
        if (typeof downloadFn === "function") {
            downloadFn();
        }
        else {
            console.error("Download function not found in module:", _.getAttribute("moduleName"));
        }
    })
        .catch((err) => console.error("Error loading module:", err));
}));
