let element = null;
export async function highLightOpCode(index) {
    if (!element) {
        element = document.querySelector('#hex-viewer');
    }
    Array.from(element.children).forEach((child, i) => {
        child.classList.remove('highlighted-opcode');
        if (i === index) {
            child.classList.add('highlighted-opcode');
        }
    });
}
export async function highLightMemory(index) {
    if (!element) {
        element = document.querySelector('#hex-viewer');
    }
    Array.from(element.children).forEach((child, i) => {
        if (i === index) {
            child.classList.add('highlighted-memory');
        }
    });
}
