<script>
import Medal from "$lib/components/Medal.svelte";

/** @type {{ item: import("$lib/state.svelte.js").EventGroup }} */
let { item } = $props();
let hasMedal = item.events.some((e) => e.medal !== "");
let n = $derived(item.events.reduce((acc, e) => (e.checked ? 1 : 0) + acc, 0));
</script>

<div class="flex items-center gap-4">
	<div class="flex items-center gap-4">
		<img
			class="w-8 h-8"
			alt={item.label.name}
			src={`https://gstatic.olympics.com/s1/t_original/static/light/pictograms-paris-2024/olympics/${item.label.shortName}_small.svg`}
		/>
		<h3 class="text-lg font-bold">
			{item.label.name.toLowerCase()}
		</h3>
	</div>
</div>
<div class="flex items-center">
	<svg
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="2"
		stroke="currentColor"
		class="size-4 mr-2 mt-0.5 {item.open ? 'visible' : 'invisible'}"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="m19.5 8.25-7.5 7.5-7.5-7.5"
		/>
	</svg>
	{#if n > 0}
		<span class="text-sm mr-2 text-gray-600">
			{n} of {item.events.length}
		</span>
	{/if}
	{#if hasMedal}
		<Medal />
	{/if}
	<input
		class="accent-gray-800 cursor-pointer"
		checked={n > 0}
		type="checkbox"
		indeterminate={n > 0 && n < item.events.length}
		onchange={() => {
			let checked = !n;
			item.events.forEach((e) => (e.checked = checked));
		}}
	/>
</div>
