// main.js
import { Chip8 } from "./chip-8/index.js";
import { PC_START } from "./values/constants.js";
const chip8 = new Chip8();
// 1) CPU loop (≈500 Hz). We’ll store a handle so we can clearInterval() later if needed.
let cpuClock = null;
let timersClock = null;
function startCPULoop() {
    console.log("Starting CPU loop...");
    if (cpuClock === null) {
        cpuClock = setInterval(() => {
            chip8.tick();
        }, 1000 / 500); // 500 Hz
    }
    if (!timersClock) {
        timersClock = setInterval(() => {
            chip8.timers.start();
        }, 1000 / 60); // 60 Hz for timers
    }
}
function stopCPULoop() {
    if (cpuClock !== null) {
        clearInterval(cpuClock);
        cpuClock = null;
    }
    if (timersClock !== null) {
        clearInterval(timersClock);
        timersClock = null;
    }
}
document
    .querySelector("#fileInput")
    .addEventListener("change", (e) => {
    e.preventDefault();
    stopCPULoop();
    const file = e.currentTarget.files?.[0];
    chip8.reset();
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    console.log("Dropped file:", file);
    reader.onload = (event) => {
        const display = document.querySelector("#hex-viewer");
        const buffer = event.target?.result;
        const rom = new Uint8Array(buffer);
        display.innerHTML = Array.from(rom)
            .map((b, i) => `<span>${b.toString(16).padStart(2, "0")}</span>`).join('');
        chip8.memory.load(rom, PC_START);
        startCPULoop();
    };
    // 5.4) Finally, start the CPU loop (and leave renderLoop running).
    // startCPULoop();
});
