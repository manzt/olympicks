<script>
	/** @typedef {import("./+page.server.js").Event} Event */
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	import Medal from "$lib/Medal.svelte";
	import Card from "$lib/Card.svelte";
	import { createIcsEntry } from "$lib/create-ics-entry.js";

	let sep = "+";
	let events = /** @type {import("./$types").PageData["events"]} */ (
		$page.data.events
	).map((evt, i) => ({ ...evt, id: String(i) }));

	let byDay = Map.groupBy(events, (item) => item.start.split("T")[0]);
	/** @type {Record<string, Array<{ code: string, events: Array<Event & { id: string }> }>>} */
	let byDayAndDisipline = {};
	/** @type {Map<string, string>} */
	let lookup = new Map();
	for (let [day, items] of byDay) {
		let grp = Object.groupBy(items, ({ discipline }) => {
			lookup.set(discipline.code, discipline.description);
			return discipline.code;
		});
		// @ts-expect-error - It thinks it's undefined
		byDayAndDisipline[day] = Object.entries(grp).map(
			([discipline, events]) => ({
				code: discipline,
				events: events?.toSorted((a, b) => {
					let cmp = a.start.localeCompare(b.start);
					return cmp === 0
						? a.description.localeCompare(b.description)
						: cmp;
				}),
			}),
		);
	}

	let days = Object.entries(byDayAndDisipline)
		.toSorted(([a], [b]) => a.localeCompare(b))
		.map(([date, disciplines]) => ({ date, disciplines }))
		.map((day) => ({
			date: day.date,
			disciplines: day.disciplines.map((discipline) => {
				let open = $state(false);
				return {
					code: discipline.code,
					/** @type {boolean} */
					get open() {
						return open;
					},
					/** @param {boolean} update */
					set open(update) {
						open = update;
					},
					/** @type {Array<Event & { checked: boolean; id: string }>} */
					events: discipline.events.map((evt) => {
						let checked = $state(false);
						return {
							...evt,
							/** @type {boolean} */
							get checked() {
								return checked;
							},
							/** @param {boolean} update */
							set checked(update) {
								checked = update;
							},
						};
					}),
				};
			}),
		}));

	onMount(() => {
		let initSel = ($page.url.searchParams.get("selected") ?? "").split(" ");
		for (let day of days) {
			for (let discipline of day.disciplines) {
				for (let event of discipline.events) {
					event.checked = initSel.includes(event.id);
				}
			}
		}
	});

	/** @param {string} str */
	function formatDate(str) {
		return new Date(str).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
		});
	}

	function show() {
		// @ts-expect-error
		this.querySelector("svg").classList.add("visible");
	}
	function hide() {
		// @ts-expect-error
		this.querySelector("svg").classList.remove("visible");
	}

	let selected = $derived(
		days.flatMap((day) => {
			return day.disciplines.flatMap((discipline) => {
				return discipline.events.filter((event) => event.checked);
			});
		}),
	);

	$effect(() => {
		let ids = selected.map((event) => event.id);
		if (ids.length === 0) {
			goto("/olympicks/?", { noScroll: true });
		} else {
			goto(`/olympicks/?selected=${ids.join(sep)}`, { noScroll: true });
		}
		// TODO: need this to work locally
		// if (ids.length === 0) {
		// 	goto("/?", { noScroll: true });
		// } else {
		// 	goto(`/?selected=${ids.join(sep)}`, { noScroll: true });
		// }
	});
</script>

<svelte:head>
	<title>olympicks</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="comic-sans">
	<h1 class="text-4xl text-center font-bold mb-2">olympicks</h1>
	<p class="text-center text-gray-500 mb-2 text-balance">add 2024 summer olympic events to your calendar</p>
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
				onmousedown={() =>
					days.forEach((day) => {
						day.disciplines.forEach((discipline) => {
							discipline.open = false;
							discipline.events.forEach((event) => {
								event.checked = false;
							});
						});
					})}><b>reset</b></button
			>
		{/if}
		<span class="tabular-nums">
			{#if selected.length > 0}
				{selected.length.toLocaleString()} of
			{/if}
			{events.length.toLocaleString()} events
		</span>
	</div>

	{#each days as day}
		<div>
			<h2
				class="text-xl flex items-center py-8 flex-end text-right sticky top-0 z-10 bg-white border-gray-600 border-b-1 h-10"
			>
				<!-- TODO: formatting the truncated date leads to the wrong day because of UTC offsets -->
				{formatDate(day.disciplines[0].events[0].start).toLowerCase()}
			</h2>
			<div class="flex flex-col">
				{#each day.disciplines as d}
					{@const hasMedal = d.events.some((e) => e.medal !== "")}
					{@const n = d.events.reduce(
						(acc, e) => (e.checked ? 1 : 0) + acc,
						0,
					)}
					<div class="flex flex-col border-gray-200 border-b">
						<button
							class="sticky top-16 flex justify-between items-center p-2 w-full cursor-pointer bg-gradient-to-b from-white from-80% to-100% to-transparent"
							onclick={function (evt) {
								if (evt.target instanceof HTMLInputElement)
									return;
								d.open = !d.open;
							}}
							onmouseover={show}
							onmouseout={hide}
							onfocus={show}
							onblur={hide}
						>
							<div class="flex items-center gap-4">
								<div class="flex items-center gap-4">
									<img
										class="w-8 h-8"
										alt={d.code}
										src={`https://gstatic.olympics.com/s1/t_original/static/light/pictograms-paris-2024/olympics/${d.code}_small.svg`}
									/>
									<h3 class="text-lg font-bold">
										{lookup.get(d.code)?.toLowerCase()}
									</h3>
								</div>
							</div>
							<div class="flex items-center">
								<svg
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="size-4 mr-2 mt-0.5 {d.open
										? 'visible'
										: 'invisible'}"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m19.5 8.25-7.5 7.5-7.5-7.5"
									/>
								</svg>
								{#if n > 0}
									<span class="text-sm mr-2 text-gray-600">
										{n} of {d.events.length}
									</span>
								{/if}
								{#if hasMedal}
									<Medal />
								{/if}
								<input
									class="accent-gray-800 cursor-pointer"
									checked={n > 0}
									type="checkbox"
									indeterminate={n > 0 && n < d.events.length}
									onchange={() => {
										let checked = !n;
										d.events.forEach(
											(e) => (e.checked = checked),
										);
									}}
								/>
							</div>
						</button>
						{#if d.open}
							<div
								class="flex flex-col items-end gap-1 last:pb-2"
							>
								{#each d.events as event}
									<Card {event} />
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
		<br />
	{/each}
</div>
