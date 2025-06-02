export class Registers {
    registers;
    constructor(size = 16) {
        this.registers = new Uint8Array(size);
    }
    getRegister(index) {
        if (index < 0 || index >= this.registers.length) {
            throw new Error(`Register index out of bounds: ${index}`);
        }
        return this.registers[index];
    }
    setRegister(index, value) {
        if (index < 0 || index >= this.registers.length) {
            throw new Error(`Register index out of bounds: ${index}`);
        }
        this.registers[index] = value & 0xff; // Ensure value is within byte range
    }
    getBuffer() {
        return this.registers;
    }
    reset() {
        this.registers.fill(0);
    }
}
