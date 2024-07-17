<script>
	/** @type {import("./+page.server.js").SelectedEvent}} */
	let { start, description, checked, match } = $props();

	/** @typedef {{ description: string, code: string }} Team */
	/**
	 * @param {typeof match} x
	 * @returns {x is { team1: Team, team2: Team }}
	 */
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

<div class="w-md p-2 mb-1 rounded-md border-1 border-gray-200">
	<div class="flex">
		<span class="font-bold tabular-nums">{formatTime(start)}</span>
		<div class="ml-4 text-gray-500">{description}</div>
		<input bind:checked type="checkbox" class="ml-auto" />
	</div>
	{#if isKnownMatch(match)}
		<div
			class="text-sm text-gray-500 w-full flex justify-center items-center mt-2"
		>
			<div class="flex items-center">
				<span class="w-20 text-wrap text-right">{match.team1.description}</span>
				<img src={getFlagUrl(match.team1)} class="w-6 h-4 ml-2 border border-gray-50" alt={match.team1.description} />
			</div>
			<span class="mx-2">vs</span>
			<div class="flex items-center">
				<img src={getFlagUrl(match.team2)} class="w-6 h-4 mr-2 border border-gray-50" alt={match.team2.description} />
				<span class="w-20 text-wrap text-left">{match.team2.description}</span>
			</div>
		</div>
	{/if}
</div>
