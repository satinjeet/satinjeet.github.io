import { highLightMemory } from "../ui/index.js";
const font = [
    0xf0,
    0x90,
    0x90,
    0x90,
    0xf0, // 0
    0x20,
    0x60,
    0x20,
    0x20,
    0x70, // 1
    0xf0,
    0x10,
    0xf0,
    0x80,
    0xf0, // 2
    0xf0,
    0x10,
    0xf0,
    0x10,
    0xf0, // 3
    0x90,
    0x90,
    0xf0,
    0x10,
    0x10, // 4
    0xf0,
    0x80,
    0xf0,
    0x10,
    0xf0, // 5
    0xf0,
    0x80,
    0xf0,
    0x90,
    0xf0, // 6
    0xf0,
    0x10,
    0x20,
    0x40,
    0x40, // 7
    0xf0,
    0x90,
    0xf0,
    0x90,
    0xf0, // 8
    0xf0,
    0x90,
    0xf0,
    0x10,
    0xf0, // 9
    0xf0,
    0x90,
    0xf0,
    0x90,
    0x90, // A
    0xe0,
    0x90,
    0xe0,
    0x90,
    0xe0, // B
    0xf0,
    0x80,
    0x80,
    0x80,
    0xf0, // C
    0xe0,
    0x90,
    0x90,
    0x90,
    0xe0, // D
    0xf0,
    0x80,
    0xf0,
    0x80,
    0xf0, // E
    0xf0,
    0x80,
    0xf0,
    0x80,
    0x80, // F
];
export class Memory {
    memory;
    constructor(size = 4096) {
        this.memory = new Uint8Array(size);
        this.setFont(); // Initialize the font in memory
    }
    load(data, offset = 0) {
        this.clear(); // Clear memory before loading new data
        this.memory.set(data, offset);
        console.log("Data loaded into memory at offset", offset);
    }
    getByte(address) {
        highLightMemory(address);
        return this.memory[address];
    }
    setByte(address, value) {
        this.memory[address] = value;
    }
    getBuffer() {
        return this.memory;
    }
    clear() {
        this.memory.fill(0);
        this.setFont(); // Reset the font after clearing memory
    }
    setFont() {
        // Set the default CHIP-8 font in memory starting at address 0x050
        font.forEach((byte, i) => this.setByte(0x050 + i, byte));
    }
}
