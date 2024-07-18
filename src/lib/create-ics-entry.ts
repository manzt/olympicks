import * as ics from "ics";

import { assert } from "./assert.ts";
import { groupBy } from "./group-by.ts";
import type * as schema from "./schema.ts";

/**
 * @param isoString ISO 8601 date string
 * @returns [year, month, day, hour, minute]
 */
function convertToIcsDate(
	isoString: string,
): [number, number, number, number, number] {
	let date = new Date(isoString);
	return [
		date.getUTCFullYear(),
		date.getUTCMonth() + 1, // getMonth() returns 0-11
		date.getUTCDate() - 1,
		date.getUTCHours(),
		date.getUTCMinutes(),
	];
}

function mergeNonMatchEventGroup(
	events: Array<schema.Event>,
): Array<{ title: string; description: string; start: string; end: string }> {
	// Sort by start time
	events.sort((a, b) => a.start.localeCompare(b.start));

	let merged: Array<
		Omit<schema.Event, "description"> & { description: Array<string> }
	> = [];

	let current:
		| (Omit<schema.Event, "description"> & { description: Array<string> })
		| null = null;

	for (let event of events) {
		if (!current) {
			current = { ...event, description: [event.description] };
		} else {
			let currentEnd = new Date(current.end);
			let eventStart = new Date(event.start);

			if (currentEnd >= eventStart) {
				let max = Math.max(currentEnd.getTime(), eventStart.getTime());
				current.end = new Date(max).toISOString();
				current.description.push(event.description);
			} else {
				// Non-overlapping, push current and reset
				merged.push(current);
				current = { ...event, description: [event.description] };
			}
		}
	}
	if (current) {
		merged.push(current);
	}
	return merged.map((e) => ({
		title: formatTitle(e),
		start: e.start,
		end: e.end,
		description: e.description.join("; "),
	}));
}

/**
 * Combines events that are not matches into a single calendar event if they overlap.
 */
function combineEntries(
	events: Array<schema.Event>,
): Array<{ title: string; description: string; start: string; end: string }> {
	// Let's group non-matches together such that they end up as a single calendar
	// event if they overlap.
	let nonMatches = events.filter((event) => !event.match);
	let groups = groupBy(
		nonMatches,
		({ discipline, start }) => `${start.split("T")[0]}${discipline.shortName}`,
	);
	let merged = Array.from(groups.values()).map((group) =>
		mergeNonMatchEventGroup(group),
	);
	let matches = events
		.filter((e) => e.match)
		.map((e) => ({
			title: formatTitle(e),
			start: e.start,
			end: e.end,
			description: `${e.description}${formatMatchEntry(e.match)}`,
		}));

	return [...merged.flat(), ...matches];
}

export function createIcsEntry(events: Array<schema.Event>): string {
	let result = ics.createEvents(
		combineEntries(events).map((event) => ({
			title: event.title,
			description: event.description,
			start: convertToIcsDate(event.start),
			end: convertToIcsDate(event.end),
			startInputType: "utc",
			startOutputType: "utc",
			endInputType: "utc",
			endOutputType: "utc",
		})),
	);
	if (result.error) {
		throw result.error;
	}
	assert(result.value, "Expected a value");
	return result.value;
}

function formatTitle(
	event: Pick<schema.Event, "match" | "discipline" | "medal">,
	prefix = "olympicks: ",
) {
	let title = event.discipline.name;
	let maybeMatch = formatMatchEntry(event.match);
	let maybeMedal = formatMedalEvent(event.medal);
	return `${prefix}${title}${maybeMatch}${maybeMedal}`;
}

function formatMatchEntry(match: schema.Event["match"]) {
	if (match.kind === "known") {
		return ` - ${match.team1.name} vs ${match.team2.name}`;
	}
	return "";
}

function formatMedalEvent(medal: schema.Event["medal"]): string {
	return `${medal ? " (medal event)" : ""}`;
}
