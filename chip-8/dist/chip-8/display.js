export class Display {
    memory;
    width;
    height;
    pixels;
    scale = 10;
    element;
    ctx;
    drawFlag = false;
    constructor(memory, width = 64, height = 32) {
        this.memory = memory;
        this.width = width;
        this.height = height;
        this.pixels = new Uint8Array(width * height);
        this.element = document.querySelector("#display");
        this.ctx = this.element.getContext("2d");
        this.element.width = this.width * this.scale;
        this.element.height = this.height * this.scale;
        this.renderLoop(); // Start the render loop
    }
    getPixels() {
        return this.pixels;
    }
    clear() {
        this.doTheDrawing();
        this.pixels.fill(0);
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.element.width, this.element.height);
    }
    /**
     * XOR a single pixel at (x,y), with wrapping.
     * Returns true if a pixel was erased (collision = 1 → 0).
     */
    setPixel(x, y) {
        x = x % this.width;
        y = y % this.height;
        const idx = x + y * this.width;
        const prev = this.pixels[idx];
        this.pixels[idx] ^= 1;
        // If prev was 1 and now is 0, that’s a collision
        return prev === 1 && this.pixels[idx] === 0;
    }
    /**
     * Draw an 8×height sprite from memory at location I,
     * placing its top-left corner at (x, y).
     * Each sprite row is one byte (bit7 → leftmost pixel).
     * Return true if any pixel was erased (VF = 1).
     */
    drawSprite(I, x, y, height) {
        let collision = false;
        for (let row = 0; row < height; row++) {
            const byte = this.memory.getByte(I + row);
            for (let bit = 0; bit < 8; bit++) {
                if ((byte & (0x80 >> bit)) !== 0) {
                    // Only if bit is 1 do we toggle that pixel:
                    const erased = this.setPixel(x + bit, y + row);
                    if (erased)
                        collision = true;
                }
            }
        }
        return collision;
    }
    /**
     * Paint the entire framebuffer to the canvas.
     * Use white for “on” pixels, black for “off.”
     */
    render() {
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.element.width, this.element.height);
        this.ctx.fillStyle = "#FFF";
        for (let i = 0; i < this.pixels.length; i++) {
            if (this.pixels[i] === 1) {
                const x = (i % this.width) * this.scale;
                const y = Math.floor(i / this.width) * this.scale;
                this.ctx.fillRect(x, y, this.scale, this.scale);
            }
        }
    }
    doTheDrawing() {
        this.drawFlag = true;
    }
    doNotDraw() {
        this.drawFlag = false;
    }
    get isDrawing() {
        return this.drawFlag;
    }
    renderLoop = () => {
        if (this.drawFlag) {
            this.render();
            this.drawFlag = false;
        }
        requestAnimationFrame(this.renderLoop);
    };
}
