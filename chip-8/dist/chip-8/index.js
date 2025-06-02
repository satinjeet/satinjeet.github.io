import { highLightOpCode } from "../ui/index.js";
import { PC_START } from "../values/constants.js";
import { Display } from "./display.js";
import { Keyboard } from "./input.js";
import { Memory } from "./memory.js";
import { Registers } from "./register.js";
import { Stack } from "./stack.js";
import { Timers } from "./timers.js";
export class Chip8 {
    memory = new Memory();
    display = new Display(this.memory);
    registers = new Registers();
    stack = new Stack();
    timers = new Timers();
    keyboard = new Keyboard(); // Keyboard input handler
    PC = PC_START; // Program Counter starts at 0x200
    I = 0; // Index register
    debugConsole = document.querySelector("#debug-console");
    constructor() { }
    tick() {
        const hi = this.memory.getByte(this.PC);
        const lo = this.memory.getByte(this.PC + 1);
        const opcode = (hi << 8) | lo;
        const x = (opcode & 0x0f00) >> 8;
        const y = (opcode & 0x00f0) >> 4;
        const nnn = opcode & 0x0fff;
        const kk = opcode & 0x00ff;
        const n = opcode & 0x000f;
        highLightOpCode(this.PC - PC_START);
        this.PC += 2;
        this.debugConsole.innerHTML = `PC: 0x${this.PC.toString(16).padStart(4, "0")} | Opcode: 0x${opcode
            .toString(16)
            .padStart(4, "0")} | X: ${x} | Y: ${y} | NNN: 0x${nnn
            .toString(16)
            .padStart(3, "0")} | KK: 0x${kk.toString(16).padStart(2, "0")} | N: ${n}`;
        switch (opcode & 0xf000) {
            case 0x0000:
                switch (opcode & 0x00ff) {
                    case 0x00e0:
                        this.display.clear();
                        break;
                    case 0x00ee:
                        this.PC = this.stack.pop();
                        break;
                    default:
                        /* 0NNN – SYS addr (ignored) */ break;
                }
                break;
            case 0x1000:
                this.PC = nnn;
                break; // JP addr
            case 0x2000:
                this.stack.push(this.PC);
                this.PC = nnn;
                break; // CALL addr
            case 0x3000:
                if (this.registers.getRegister(x) === kk)
                    this.PC += 2;
                break; // SE Vx, byte
            case 0x4000:
                if (this.registers.getRegister(x) !== kk)
                    this.PC += 2;
                break; // SNE Vx, byte
            case 0x5000:
                if (this.registers.getRegister(x) === this.registers.getRegister(y))
                    this.PC += 2;
                break; // SE Vx, Vy
            case 0x6000:
                this.registers.setRegister(x, kk);
                break; // LD Vx, byte
            case 0x7000:
                this.registers.setRegister(x, (this.registers.getRegister(x) + kk) & 0xff);
                break; // ADD Vx, byte
            case 0x8000:
                const vx = this.registers.getRegister(x);
                const vy = this.registers.getRegister(y);
                switch (n) {
                    case 0x0:
                        this.registers.setRegister(x, vy);
                        break; // LD Vx, Vy
                    case 0x1:
                        this.registers.setRegister(x, vx | vy);
                        break; // OR
                    case 0x2:
                        this.registers.setRegister(x, vx & vy);
                        break; // AND
                    case 0x3:
                        this.registers.setRegister(x, vx ^ vy);
                        break; // XOR
                    case 0x4: {
                        // ADD with carry
                        const sum = vx + vy;
                        this.registers.setRegister(x, sum & 0xff);
                        this.registers.setRegister(0xf, sum > 0xff ? 1 : 0);
                        break;
                    }
                    case 0x5: {
                        // SUB
                        this.registers.setRegister(0xf, vx > vy ? 1 : 0);
                        this.registers.setRegister(x, (vx - vy) & 0xff);
                        break;
                    }
                    case 0x6: {
                        // SHR
                        this.registers.setRegister(0xf, vx & 0x1);
                        this.registers.setRegister(x, vx >> 1);
                        break;
                    }
                    case 0x7: {
                        // SUBN
                        this.registers.setRegister(0xf, vy > vx ? 1 : 0);
                        this.registers.setRegister(x, (vy - vx) & 0xff);
                        break;
                    }
                    case 0xe: {
                        // SHL
                        this.registers.setRegister(0xf, (vx >> 7) & 0x1);
                        this.registers.setRegister(x, (vx << 1) & 0xff);
                        break;
                    }
                }
                break;
            case 0x9000:
                if (this.registers.getRegister(x) !== this.registers.getRegister(y))
                    this.PC += 2;
                break; // SNE Vx, Vy
            case 0xa000:
                this.I = nnn;
                break; // LD I, addr
            case 0xb000:
                this.PC = nnn + this.registers.getRegister(0);
                break; // JP V0, addr
            case 0xc000:
                const rand = Math.floor(Math.random() * 256);
                this.registers.setRegister(x, rand & kk);
                break; // RND Vx, byte
            case 0xd000: {
                // DRW Vx, Vy, nibble
                const spriteX = this.registers.getRegister(x);
                const spriteY = this.registers.getRegister(y);
                const collision = this.display.drawSprite(this.I, spriteX, spriteY, n);
                this.registers.setRegister(0xf, collision ? 1 : 0);
                this.display.doTheDrawing();
                break;
            }
            case 0xe000:
                switch (opcode & 0x00ff) {
                    case 0x9e: // SKP Vx
                        if (this.keyboard.isKeyPressed(this.registers.getRegister(x)))
                            this.PC += 2;
                        break;
                    case 0xa1: // SKNP Vx
                        if (!this.keyboard.isKeyPressed(this.registers.getRegister(x)))
                            this.PC += 2;
                        break;
                }
                break;
            case 0xf000:
                switch (opcode & 0x00ff) {
                    case 0x07: // LD Vx, DT
                        this.registers.setRegister(x, this.timers.getDelayTimer());
                        break;
                    case 0x0a: // LD Vx, K (blocking wait)
                        const key = this.keyboard.waitForKeyPress(); // you may implement this async
                        if (key === null) {
                            this.PC -= 2; // Wait
                        }
                        else {
                            this.registers.setRegister(x, key);
                        }
                        break;
                    case 0x15: // LD DT, Vx
                        this.timers.setDelayTimer(this.registers.getRegister(x));
                        break;
                    case 0x18: // LD ST, Vx
                        this.timers.setSoundTimer(this.registers.getRegister(x));
                        break;
                    case 0x1e: // ADD I, Vx
                        this.I = (this.I + this.registers.getRegister(x)) & 0xffff;
                        break;
                    case 0x29: // LD F, Vx (sprite address)
                        this.I = this.registers.getRegister(x) * 5; // font sprite address
                        break;
                    case 0x33: {
                        // LD B, Vx (BCD)
                        const value = this.registers.getRegister(x);
                        this.memory.setByte(this.I, Math.floor(value / 100));
                        this.memory.setByte(this.I + 1, Math.floor((value % 100) / 10));
                        this.memory.setByte(this.I + 2, value % 10);
                        break;
                    }
                    case 0x55: // LD [I], Vx
                        for (let i = 0; i <= x; i++)
                            this.memory.setByte(this.I + i, this.registers.getRegister(i));
                        break;
                    case 0x65: // LD Vx, [I]
                        for (let i = 0; i <= x; i++)
                            this.registers.setRegister(i, this.memory.getByte(this.I + i));
                        break;
                }
                break;
            default:
                console.warn(`Unknown opcode: 0x${opcode.toString(16).padStart(4, "0")}`);
                break;
        }
    }
    reset() {
        this.memory.clear();
        this.display.clear();
        this.registers.reset();
        this.stack.clear();
        this.timers.reset();
        this.PC = PC_START; // Reset Program Counter
        this.I = 0; // Reset Index Register
        this.display.doNotDraw(); // Reset draw flag
    }
}
