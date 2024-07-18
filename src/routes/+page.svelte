<script>
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	import { Section } from "$lib/state.svelte.js";
	import { createIcsEntry } from "$lib/create-ics-entry.js";
	import Collapsible from "$lib/components/Collapsible.svelte";
	import Card from "$lib/components/Card.svelte";
    import Trigger from "$lib/components/Trigger.svelte";

	/** @type {import("./$types").PageData["sections"]} */
	let raw = $page.data.sections;
	let sections = raw.map((sec) => new Section(sec.name, sec.items));

	onMount(() => {
		let initSel = ($page.url.searchParams.get("selected") ?? "").split(" ");
		for (let sec of sections) {
			for (let item of sec.items) {
				for (let event of item.events) {
					event.checked = initSel.includes(event.id);
				}
			}
		}
	});

	// just get a nice reference to the selected events
	let events = sections.flatMap((sec) =>
		sec.items.flatMap((item) => item.events),
	);

	let selected = $derived(events.filter((event) => event.checked));

	$effect(() => {
		let ids = selected.map((event) => event.id);
		let url = new URL($page.url);
		url.searchParams.delete("selected");
		if (ids.length > 0) {
			url.searchParams.append("selected", ids.join(" "));
		}
		goto(url.href, { noScroll: true });
	});
</script>

<svelte:head>
	<title>olympicks</title>
	<meta
		name="description"
		content="export 2024 summer olympic events to your calendar"
	/>
</svelte:head>

<div class="comic-sans">
	<h1 class="text-4xl text-center font-bold mb-2">olympicks</h1>
	<p class="text-center text-gray-500 mb-2 text-balance">
		export 2024 summer olympic events to your calendar
	</p>
</div>

<br />

<div class="flex flex-col">
	<div
		class="text-sm top-5 sticky z-20 text-gray-600 bg-white bg-opacity-30 self-end h-5"
	>
		{#if selected.length > 0}
			<button
				class="cursor-pointer font-light text-gray-50 mr-2 rounded px-2 border border-gray-100 bg-gray-800"
				title="Export selected events to .ics file"
				onmousedown={async () => {
					let contents = createIcsEntry(selected);
					let file = new File([contents], "olympicks.ics", {
						type: "text/calendar",
					});
					let url = URL.createObjectURL(file);
					let a = document.createElement("a");
					a.href = url;
					a.download = "olympicks.ics";
					a.click();
					URL.revokeObjectURL(url);
				}}><b>export</b> .ics</button
			>
			<button
				class="cursor-pointer border-none text-bold mr-2"
				title="Reset all selections"
				onmousedown={() => sections.forEach((sec) => sec.reset())}
				><b>reset</b></button
			>
		{/if}
		<span class="tabular-nums">
			{#if selected.length > 0}
				{selected.length.toLocaleString()} of
			{/if}
			{$page.data.totalEvents.toLocaleString()} events
		</span>
	</div>

	{#each sections as { title, items }}
		<div>
			<h2
				class="text-xl flex items-center py-8 flex-end text-right sticky top-0 z-10 bg-white border-gray-600 border-b-1 h-10"
			>
				{title}
			</h2>
			<div class="flex flex-col">
				{#each items as item}
<Collapsible open={item.open}>
	{#snippet trigger()}
		<Trigger {item} />
	{/snippet}
	{#snippet content()}
		<div class="flex flex-col items-end gap-1 last:pb-2">
			{#each item.events as event}
				<Card {event} />
			{/each}
		</div>
	{/snippet}
</Collapsible>
				{/each}
			</div>
		</div>
		<br />
	{/each}
</div>
