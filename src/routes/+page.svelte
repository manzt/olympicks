<script>
	import { page } from "$app/stores";
	import Card from "./Card.svelte";

	/** @type {import("./$types").PageData["days"]} */
	let days = $state($page.data.days);
	/** @type {import("./$types").PageData["lookup"]} */
	let lookup = $page.data.lookup;

	/** @param {string} str */
	function formatDate(str) {
		return new Date(str).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
		});
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex flex-col">
	{#each days as day}
		<div>
			<h2 class="text-xl">{formatDate(day.date)}</h2>
			<div class="flex flex-col border-t-1 pt-6">
				{#each day.disciplines as d}
					<div class="flex justify-between mb-10">
						<div>
							<div class="flex items-center gap-4">
								<input
									checked={!d.events.every(
										(evt) => !evt.checked,
									)}
									type="checkbox"
									onchange={() => {
										const checked = d.events.every(
											(evt) => !evt.checked,
										);
										d.events.forEach(
											(event) =>
												(event.checked = checked),
										);
									}}
								/>
								<img
									class="w-8 h-8"
									alt={d.code}
									src={`https://gstatic.olympics.com/s1/t_original/static/light/pictograms-paris-2024/olympics/${d.code}_small.svg`}
								/>
								<h3 class="text-lg font-bold">{lookup.get(d.code)}</h3>
							</div>
						</div>
						<div class="flex flex-col">
							{#each d.events as event}<Card {event} />{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
		<br />
	{/each}
</div>
