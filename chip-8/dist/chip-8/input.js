// keyboard.js
export class Keyboard {
    keys = new Array(16).fill(false);
    keyMap = {
        Digit1: 0x1,
        Digit2: 0x2,
        Digit3: 0x3,
        Digit4: 0xc,
        KeyQ: 0x4,
        KeyW: 0x5,
        KeyE: 0x6,
        KeyR: 0xd,
        KeyA: 0x7,
        KeyS: 0x8,
        KeyD: 0x9,
        KeyF: 0xe,
        KeyZ: 0xa,
        KeyX: 0x0,
        KeyC: 0xb,
        KeyV: 0xf,
    };
    blockingKey = undefined;
    constructor() {
        window.addEventListener("keydown", (e) => {
            if (this.keyMap[e.code] !== undefined) {
                this.keys[this.keyMap[e.code]] = true;
                this.blockingKey = this.keyMap[e.code];
            }
        });
        window.addEventListener("keyup", (e) => {
            if (this.keyMap[e.code] !== undefined) {
                this.keys[this.keyMap[e.code]] = false;
                this.blockingKey = undefined;
            }
        });
    }
    waitForKeyPress() {
        return this.blockingKey !== undefined ? this.blockingKey : null;
    }
    isKeyPressed(hexKey) {
        return this.keys[hexKey];
    }
}
