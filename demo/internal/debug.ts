// If debug is initially set to false it will not be toggleable.
export let debug = true;

const debugListeners: ((debug: boolean) => void)[] = [];
export const onDebugStateChange = (fn: (debug: boolean) => void) => {
    debugListeners.push(fn);
    fn(debug);
};

if (debug && document.body) {
    const toggleButton = document.createElement("button");
    toggleButton.innerHTML = "debug";
    toggleButton.style.padding = "2rem";
    toggleButton.style.position = "fixed";
    toggleButton.style.top = "0";
    toggleButton.onclick = () => {
        debug = !debug;
        for (const listener of debugListeners) {
            listener(debug);
        }
    };
    document.body.prepend(toggleButton);
}
