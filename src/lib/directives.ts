/** Selects the text in the node when it is focused */
export function selectTextOnFocus(node: HTMLElement) {
	let handleFocus = (_: Event) => {
		// @ts-expect-error
		node && typeof node.select === "function" && node.select();
	};
	node.addEventListener("focus", handleFocus);
	return {
		destroy() {
			node.removeEventListener("focus", handleFocus);
		},
	};
}

/** Blurs the node when Escape is pressed */
export function blurOnEscape(node: HTMLInputElement) {
	let handleKey = (event: KeyboardEvent) => {
		if (event.key !== "Escape") return;
		node.value = "";
		node.dispatchEvent(new Event("input"));
		node.blur?.();
	};
	node.addEventListener("keydown", handleKey);
	return {
		destroy() {
			node.removeEventListener("keydown", handleKey);
		},
	};
}
