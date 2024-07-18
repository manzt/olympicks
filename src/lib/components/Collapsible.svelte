<script lang="ts">
import type { Snippet } from "svelte";
import { slide } from "svelte/transition";
let {
	open = $bindable(),
	trigger,
	content,
}: {
	open: boolean;
	trigger: Snippet;
	content: Snippet;
} = $props();

function show() {
	// @ts-expect-error
	this.querySelector("svg").classList.add("visible");
}
function hide() {
	// @ts-expect-error
	this.querySelector("svg").classList.remove("visible");
}
</script>

<div class="flex flex-col border-gray-200 border-b">
	<button
		class="sticky top-16 flex justify-between items-center p-2 w-full cursor-pointer bg-gradient-to-b from-white from-80% to-100% to-transparent"
		onclick={(evt) => {
			if (evt.target instanceof HTMLInputElement) return;
			open = !open;
		}}
		onmouseover={show}
		onmouseout={hide}
		onfocus={show}
		onblur={hide}
	>
		{@render trigger()}
	</button>
	{#if open}
		<div transition:slide={{ duration: 300 }}>
			{@render content()}
		</div>
	{/if}
</div>
