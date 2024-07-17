<script>
	import { page } from "$app/stores";
	import Card from "./Card.svelte";

	/** @type {import("./$types").PageData["days"]} */
	let days = $state($page.data.days);

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
	{#each days as [day, disciplines]}
		<div>
			<h2 class="text-xl">{formatDate(day)}</h2>
			<div class="flex flex-col border-t-1 pt-6">
				{#each disciplines.entries() as [code, events]}
					<div class="flex justify-between">
						<div>
							<div class="flex items-center gap-4">
								<img class="w-8 h-8" alt={code} src={`https://gstatic.olympics.com/s1/t_original/static/light/pictograms-paris-2024/olympics/${code}_small.svg`} />
								<h3 class="text-lg font-bold">{$page.data.lookup.get(code)}</h3>
							</div>
						</div>
						<div class="flex flex-col">
							{#each events as event}
								<Card {...event} />
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
		<br />
	{/each}
</div>
