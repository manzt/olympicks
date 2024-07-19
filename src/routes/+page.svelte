<script lang="ts">
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import posthog from "posthog-js";
import { onMount } from "svelte";
import type { PageData } from "./$types.ts";

import Card from "$lib/components/Card.svelte";
import Collapsible from "$lib/components/Collapsible.svelte";
import Trigger from "$lib/components/Trigger.svelte";
import { createIcsEntry } from "$lib/create-ics-entry.ts";
import { blurOnEscape, selectTextOnFocus } from "$lib/directives.ts";
import { groupBy } from "$lib/group-by.ts";
import { EventGroup, SelectableEvent } from "$lib/state.svelte.ts";

let events = ($page.data as PageData).events.map((e) => new SelectableEvent(e));
let byMonthDay = groupBy(events, (item) => stringifyMonthDay(item.start));
let byMonthDayAndDiscipline: Record<string, Array<EventGroup>> = {};

for (let [monthDayString, items] of byMonthDay) {
	// Group by discipline short name.
	let grp = groupBy(items, ({ discipline }) => discipline.shortName);
	byMonthDayAndDiscipline[monthDayString] = Array.from(grp.entries()).map(
		// Just grab the label from the first event.
		// We know there has to be at least one event
		// in the group (for the grouping to exist).
		([shortName, events]) =>
			new EventGroup(
				{ name: events[0].discipline.name, shortName: shortName },
				events.toSorted((a, b) => {
					/**
					 * A custom sort function for events.
					 *
					 * 1.) Sort by start date.
					 * 2.) If the start dates are the same, sort by description (i.e., the event name)
					 */
					let cmp = a.start.localeCompare(b.start);
					return cmp === 0 ? a.description.localeCompare(b.description) : cmp;
				}),
			),
	);
}

/** Sort by the children events start data. It's ok to index because we know there is at least one event */
let sections = Object.entries(byMonthDayAndDiscipline)
	.toSorted(([_a, a], [_b, b]) =>
		a[0].events[0].start.localeCompare(b[0].events[0].start),
	)
	.map(([_, items]) => ({
		title: stringifyMonthDay(items[0].events[0].start),
		items: items,
	}));

// We want to do this on the client to have the user's timezone
function stringifyMonthDay(isoDateString: string) {
	return new Date(isoDateString).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
	});
}

onMount(() => {
	let url = new URL($page.url);
	let selected = url.searchParams.get("selected") ?? "";
	let ids = selected.split(" ");
	for (let event of events) {
		if (ids.includes(event.id)) {
			event.checked = true;
		}
	}
});

let checked = $derived(events.filter((e) => e.checked));

$effect(() => {
	let ids = checked.map((e) => e.id);
	let url = new URL($page.url);
	url.searchParams.delete("selected");
	if (ids.length > 0) {
		url.searchParams.append("selected", ids.join(" "));
	}
	goto(url.href, { noScroll: true });
});

let search = $state("");

$effect(() => {
	let tokens = Array.from(new Set(search.toLowerCase().split(" ")));
	for (let section of sections) {
		for (let item of section.items) {
			// Close all groups
			item.open = false;
			for (let event of item.events) {
				if (tokens.length === 0) {
					event.visible = true;
					continue;
				}
				let toSearch = [
					event.description.toLowerCase(),
					event.discipline.name.toLowerCase(),
					event.discipline.shortName.toLowerCase(),
				];
				event.visible = tokens.every((t) =>
					toSearch.some((str) => str.includes(t)),
				);
			}
		}
	}
});
</script>

<svelte:head>
	<title>olympicks</title>
	<meta name="description"
		content="export 2024 summer olympic events to your calendar"
	/>
</svelte:head>

<div class="comic-sans">
	<h1 class="text-4xl text-center font-bold mb-2">olympicks</h1>
	<p class="text-center text-gray-500 mb-2 text-balance">
		export 2024 summer olympic events to your calendar
	</p>
</div>

<input
	class="w-full p-2 mt-2 accent-gray-600 rounded-md border-1 border-gray-200"
	type="search"
	placeholder="Filter events..."
	bind:value={search}
	use:selectTextOnFocus
	use:blurOnEscape
/>

<br />

<div class="flex flex-col">
	<div
		class="text-sm top-5 sticky z-20 text-gray-600 bg-white bg-opacity-30 self-end h-5"
	>
		{#if checked.length > 0}
			<button
				class="cursor-pointer font-light text-gray-50 mr-2 rounded px-2 border border-gray-100 bg-gray-800"
				title="Export selected events to .ics file"
				onmousedown={async () => {
					posthog.capture("Export Calendar Events", { checked: checked.map((e) => e.id).join(" ") });
					let contents = createIcsEntry(checked);
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
				onmousedown={() => {
					for (let section of sections) {
						for (let item of section.items) {
							item.reset();
						}
					}
				}}
				><b>reset</b></button
			>
		{/if}
		<span class="tabular-nums">
			{#if checked.length > 0}
				{checked.length.toLocaleString()} of
			{/if}
			{events.length.toLocaleString()} events
		</span>
	</div>

	{#each sections as { title, items }}
		{@const visible = items.some(i => i.events.some(e => e.visible))}
		{#if visible}
			<div>
				<h2
					class="text-xl flex items-center py-8 flex-end text-right sticky top-0 z-10 bg-white border-gray-600 border-b-1 h-10"
				>
					{title}
				</h2>
				<div class="flex flex-col">
					{#each items as item}
						{@const filtered = item.events.filter(e => e.visible)}
						{#if filtered.length > 0}
							<Collapsible bind:open={item.open}>
								{#snippet trigger()}
									<Trigger {item} />
								{/snippet}
								{#snippet content()}
									<div class="flex flex-col items-end gap-1 last:pb-2">
										{#each filtered as event}
											<Card {event} />
										{/each}
									</div>
								{/snippet}
							</Collapsible>
						{/if}
					{/each}
				</div>
			</div>
			<br />
		{/if}
	{/each}
</div>
