<script>
	/** @type {{ event: import("./+page.server.js").Event & { checked:  boolean }}} */
	let { event } = $props();

	/** @typedef {{ description: string, code: string }} Team */
	/**
	 * @param {any} x
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

{#snippet medal()}
<svg
	class="w-6 h-6 mt-1.5 mr-1"
	viewBox="0 0 32 32"
	fill="none"
	><path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M12.0009 18.0002C13.1796 18.0002 14.2362
			16.9987 14.2362 15.6366C14.2362 14.2745 13.1796 13.2729 12.0009
			13.2729C10.8223 13.2729 9.76562 14.2745 9.76562 15.6366C9.76562
			16.9987 10.8223 18.0002 12.0009 18.0002ZM12.0009 20.0002C14.34
			20.0002 16.2362 18.0466 16.2362 15.6366C16.2362 13.2266 14.34
			11.2729 12.0009 11.2729C9.66183 11.2729 7.76562 13.2266 7.76562
			15.6366C7.76562 18.0466 9.66183 20.0002 12.0009 20.0002Z"
		fill="#000000"
	></path><path
		d="M8.70588 4H4L7.76471 11.7576C8.51765
			10.5939 10.2745 9.9798 11.0588 9.81818L8.70588 4Z"
		fill="#000000"
	></path><path
		d="M15.2941 4H20L16.2353
			11.7576C15.4823 10.5939 13.7255 9.9798 12.9412 9.81818L15.2941 4Z"
		fill="#000000"
	></path></svg
>
{/snippet}

<button
	class="w-md p-2 rounded-md cursor-pointer border-1 {event.checked
		? 'border-gray-700'
		: 'border-gray-200'}"
	onclick={() => (event.checked = !event.checked)}
>
	<div class="flex justify-between">
		<div class="flex">
			<span class="font-bold tabular-nums">{formatTime(event.start)}</span>
			<div class="ml-4 text-gray-500">{event.description}</div>
		</div>

		<div>
			{#if event.medal !== ""}
				{@render medal()}
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
