// Closes a popout (the nav menu, the social links) when the user is done with it:
//   - the mouse leaves the element and everything inside it (after a short grace period, so
//     crossing the gap between the button and its links doesn't close it)
//   - a click or tap lands outside it
//   - Escape is pressed
// Use as `use:dismiss={{ open, close }}` on the element that contains both the button and
// the popout. Nothing is listened to while it's closed.
export interface DismissParams {
	open: boolean;
	close: () => void;
	/** Milliseconds the mouse can be away before the popout closes. */
	delay?: number;
}

export function dismiss(node: HTMLElement, initial: DismissParams) {
	let params = initial;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const cancel = () => {
		clearTimeout(timer);
		timer = undefined;
	};

	function onLeave(event: PointerEvent) {
		// Touch has no hover, so it only closes through the outside tap or Escape.
		if (!params.open || event.pointerType !== 'mouse') return;
		cancel();
		timer = setTimeout(() => params.close(), params.delay ?? 250);
	}

	function onDocumentPointerDown(event: PointerEvent) {
		if (params.open && !node.contains(event.target as Node)) params.close();
	}

	function onKeydown(event: KeyboardEvent) {
		if (params.open && event.key === 'Escape') params.close();
	}

	node.addEventListener('pointerleave', onLeave);
	node.addEventListener('pointerenter', cancel);
	document.addEventListener('pointerdown', onDocumentPointerDown);
	document.addEventListener('keydown', onKeydown);

	return {
		update(next: DismissParams) {
			params = next;
			if (!next.open) cancel();
		},
		destroy() {
			cancel();
			node.removeEventListener('pointerleave', onLeave);
			node.removeEventListener('pointerenter', cancel);
			document.removeEventListener('pointerdown', onDocumentPointerDown);
			document.removeEventListener('keydown', onKeydown);
		}
	};
}
