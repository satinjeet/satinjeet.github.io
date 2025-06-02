export function download() {
    // CHIP-8 instructions to:
    // - Load sprite at I = 0x300
    // - Draw sprite at V0, V1 (0,0)
    // - Loop
    const program = new Uint8Array([
        0xa3,
        0x00, // ANNN = A300
        0x60,
        0x04, // 6000 = LD V0, 0
        0x61,
        0x01, // 6100 = LD V1, 0
        0xd0,
        0x15, // DXYN = D015 (draw 5 rows)
        0x12,
        0x00, // 1200 = JP 0x200 (infinite loop)
    ]);
    // Sprite: 5 bytes for a 5x5 "hello square"
    //
    //    We’ll draw a hollow square (5×5). Replace these bytes if you want a different shape.
    //    Each row is 8 bits; the leftmost 5 bits are used. (0b11111000 is bytes 0xF8 in hex.)
    //
    //    For example:
    //      11111000  <-- row 0: █████
    //      10001000  <-- row 1: █   █
    //      10101000  <-- row 2: █ █ █
    //      10001000  <-- row 3: █   █
    //      11111000  <-- row 4: █████
    //
    const sprite = new Uint8Array([
        0b11111000, 0b10001000, 0b10101000, 0b10001000, 0b11111000,
    ]);
    // Final ROM will have:
    // - program starts at 0x200
    // - sprite starts at 0x300 (so we pad in between)
    const ROM_SIZE = 0x100 + sprite.length;
    const rom = new Uint8Array(ROM_SIZE);
    // Copy program into ROM at offset 0x0000
    program.forEach((byte, i) => {
        rom[i] = byte; // Save program starting at 0x200
    });
    // Copy sprite into ROM at offset (0x300 - 0x200) = 256
    sprite.forEach((byte, i) => {
        rom[0x100 + i] = byte; // 0x100 = 768
    });
    // Write to a file and download
    const blob = new Blob([rom], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "basic-zero.rom";
    document.body.appendChild(a);
    a.click();
    // Clean up
    URL.revokeObjectURL(url);
    // Remove the link element
    document.body.removeChild(a);
}
