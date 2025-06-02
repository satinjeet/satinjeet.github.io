export class Timers {
    delayTimer;
    soundTimer;
    intervalId = -1;
    constructor() {
        this.delayTimer = 0;
        this.soundTimer = 0;
    }
    getDelayTimer() {
        return this.delayTimer;
    }
    setDelayTimer(value) {
        this.delayTimer = value & 0xff; // Ensure value is within byte range
    }
    getSoundTimer() {
        return this.soundTimer;
    }
    setSoundTimer(value) {
        this.soundTimer = value & 0xff; // Ensure value is within byte range
    }
    start() {
        this.intervalId = setInterval(() => {
            if (this.delayTimer > 0) {
                this.delayTimer--;
            }
            if (this.soundTimer > 0) {
                this.soundTimer--;
                // Here you could trigger a sound or beep if needed
            }
        }, 1000 / 60); // 60 Hz, typical for CHIP-8
    }
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = -1;
        }
    }
    reset() {
        this.delayTimer = 0;
        this.soundTimer = 0;
    }
}
