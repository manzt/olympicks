<script lang="ts">
import Medal from "$lib/components/Medal.svelte";
import type { Label } from "$lib/schema.ts";
import type { SelectableEvent } from "$lib/state.svelte.ts";

let { event }: { event: SelectableEvent } = $props();

function formatTime(str: string): string {
	return new Date(str).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: false,
	});
}

function getFlagUrl(team: Label) {
	let code = team.shortName;
	return `https://gstatic.olympics.com/s1/f_auto/static/light/flag/paris-2024/olympic/3x2/${code}.svg`;
}
</script>

<button
	class="w-full md:w-md p-2 rounded-md cursor-pointer border-1 {event.checked
		? 'border-gray-700'
		: 'border-gray-200'}"
	onclick={() => event.toggle()}
>
	<div class="flex justify-between">
		<div class="flex text-ellipsis flex-1 overflow-hidden">
			<span class="font-bold tabular-nums">{formatTime(event.start)}</span
			>
			<div class="ml-4 text-gray-500 flex-1 kext-balance text-left">
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
				class="accent-gray-800 cursor-pointer"
			/>
		</div>
	</div>
	{#if event.match.kind === "known"}
		<div
			class="text-sm text-gray-500 w-full flex justify-center items-center mt-2 h-10"
		>
			<div class="flex items-center">
				<span class="w-20 text-wrap text-right"
					>{event.match.team1.name.toLowerCase()}</span
				>
				<img
					src={getFlagUrl(event.match.team1)}
					class="w-6 h-4 ml-2 border border-gray-50"
					alt={event.match.team1.name}
				/>
			</div>
			<span class="mx-2">vs</span>
			<div class="flex items-center">
				<img
					src={getFlagUrl(event.match.team2)}
					class="w-6 h-4 mr-2 border border-gray-50"
					alt={event.match.team2.name}
				/>
				<span class="w-20 text-wrap text-left"
					>{event.match.team2.name.toLowerCase()}</span
				>
			</div>
		</div>
	{/if}
</button>
