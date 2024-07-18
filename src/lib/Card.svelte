<script>
	import Medal from "./Medal.svelte";

	/** @type {{ event: import("../routes/+page.server.js").Event & { checked:  boolean }}} */
	let { event } = $props();

	/** @typedef {{ description: string, code: string }} Team */
	/**
	 * @param {any} x
	 * @returns {x is { team1: Team, team2: Team }} */
	function isKnownMatch(x) {
		return typeof x === "object" && "team1" in x;
	}

	/** @param {string} str */
	function formatTime(str) {
		return new Date(str).toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: false,
		});
	}

	/** @param {Team} team */
	function getFlagUrl(team) {
		return `https://gstatic.olympics.com/s1/f_auto/static/light/flag/paris-2024/olympic/3x2/${team.code}.svg`;
	}
</script>

<button
	class="w-full md:w-md p-2 rounded-md cursor-pointer border-1 {event.checked
		? 'border-gray-700'
		: 'border-gray-200'}"
	onclick={() => (event.checked = !event.checked)}
>
	<div class="flex justify-between">
		<div class="flex text-ellipsis flex-1 overflow-hidden">
			<span class="font-bold tabular-nums"
				>{formatTime(event.start)}</span
			>
			<div
				class="ml-4 text-gray-500 flex-1 kext-balance text-left"
			>
				{event.description.toLowerCase()}
			</div>
		</div>

		<div class="flex">
			{#if event.medal !== ""}
				<Medal />
			{/if}
			<input
				bind:checked={event.checked}
				type="checkbox"
				class="accent-gray-600 cursor-pointer"
			/>
		</div>
	</div>
	{#if isKnownMatch(event.match)}
		<div
			class="text-sm text-gray-500 w-full flex justify-center items-center mt-2 h-10"
		>
			<div class="flex items-center">
				<span class="w-20 text-wrap text-right"
					>{event.match.team1.description}</span
				>
				<img
					src={getFlagUrl(event.match.team1)}
					class="w-6 h-4 ml-2 border border-gray-50"
					alt={event.match.team1.description}
				/>
			</div>
			<span class="mx-2">vs</span>
			<div class="flex items-center">
				<img
					src={getFlagUrl(event.match.team2)}
					class="w-6 h-4 mr-2 border border-gray-50"
					alt={event.match.team2.description}
				/>
				<span class="w-20 text-wrap text-left"
					>{event.match.team2.description}</span
				>
			</div>
		</div>
	{/if}
</button>
