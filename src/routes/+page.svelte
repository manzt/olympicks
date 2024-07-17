<script>
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import Card from "./Card.svelte";
	let data = /** @type {import("./$types").PageData} */ ($page.data);

	let init = ($page.url.searchParams.get("selected") ?? "").split(":");
	let days = data.days.map((day) => ({
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
				events: discipline.events.map((evt) => {
					let checked = $state(init.includes(evt.id));
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

	/** @param {string} str */
	function formatDate(str) {
		return new Date(str).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
		});
	}

	let selected = $derived(
		days.flatMap((day) => {
			return day.disciplines.flatMap((discipline) => {
				return discipline.events.filter((event) => event.checked);
			});
		})
		.map((event) => event.id)
	);

	$effect(() => {
		let ids = selected.map((event) => event.id);
		let url = new URL(location.href);
		if (ids.length) {
			url.searchParams.set("selected", ids.join(":"));
		} else {
			url.searchParams.delete("selected");
		}
		goto(url, { noScroll: true });
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex justify-between items-end">
	<div>
		<h1 class="text-3xl font-bold">Paris 2024 Olympics</h1>
		<p class="text-gray-600">Select the events you want to watch</p>
	</div>

	<div class="">
		<button
			class="cursor-pointer border-none"
			onclick={() =>
				days.forEach((day) => {
					day.disciplines.forEach((discipline) => {
						discipline.events.forEach((event) => {
							event.checked = false;
						});
					});
				})}>Reset</button
		>
		<span class="tabular-nums">
			{selected.length.toLocaleString()}

		</span>
	</div>
</div>

<div class="flex flex-col">
	{#each days as day}
		<div>
			<h2
				class="text-xl flex items-center flex-end text-right sticky top-0 z-10 bg-white border-gray-600 border-b-1 h-10"
			>
				{formatDate(day.date)}
			</h2>
			<div class="flex flex-col">
				{#each day.disciplines as d}
					{@const n = d.events.reduce(
						(acc, e) => (e.checked ? 1 : 0) + acc,
						0,
					)}
					<div class="flex flex-col border-gray-200 border-b">
						<button
							class="sticky top-10 flex justify-between items-center p-2 w-full cursor-pointer bg-gradient-to-b from-white to-transparent"
							onclick={function (evt) {
								if (evt.target instanceof HTMLInputElement)
									return;
								d.open = !d.open;
							}}
							onmouseover={function () {
								// @ts-expect-error
								this.querySelector("svg").classList.add(
									"visible",
								);
							}}
							onmouseout={function () {
								// @ts-expect-error
								this.querySelector("svg").classList.remove(
									"visible",
								);
							}}
							onfocus={function () {
								// @ts-expect-error
								this.querySelector("svg").classList.add(
									"visible",
								);
							}}
							onblur={function () {
								// @ts-expect-error
								this.querySelector("svg").classList.remove(
									"visible",
								);
							}}
						>
							<div class="flex items-center gap-4">
								<div class="flex items-center gap-4">
									<img
										class="w-8 h-8"
										alt={d.code}
										src={`https://gstatic.olympics.com/s1/t_original/static/light/pictograms-paris-2024/olympics/${d.code}_small.svg`}
									/>
									<h3 class="text-lg font-bold">
										{$page.data.lookup.get(d.code)}
									</h3>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										class="size-4 {d.open
											? 'visible'
											: 'invisible'}"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="m19.5 8.25-7.5 7.5-7.5-7.5"
										/>
									</svg>
								</div>
							</div>
							<div class="flex">
								{#if n > 0}
									<span class="text-sm mr-2 text-gray-600">
										{n} of {d.events.length}
									</span>
								{/if}

								<input
									class="accent-gray-800"
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
