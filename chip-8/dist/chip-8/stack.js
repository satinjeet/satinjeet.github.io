export class Stack {
    stack;
    sp; // Stack pointer
    constructor(size = 16) {
        this.stack = new Uint16Array(size);
        this.sp = -1; // Initialize stack pointer to -1 (empty stack)
    }
    push(value) {
        if (this.sp >= this.stack.length - 1) {
            throw new Error("Stack overflow");
        }
        this.stack[++this.sp] = value & 0xffff; // Ensure value is within 16-bit range
    }
    pop() {
        if (this.sp < 0) {
            throw new Error("Stack underflow");
        }
        return this.stack[this.sp--];
    }
    getStack() {
        return this.stack.subarray(0, this.sp + 1);
    }
    clear() {
        this.sp = -1; // Reset stack pointer to empty
    }
    getSize() {
        return this.sp + 1; // Return the number of items in the stack
    }
    isEmpty() {
        return this.sp < 0; // Check if stack is empty
    }
}
