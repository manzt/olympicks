/** @import * as schema from "./schema.js" */
import * as ics from "ics";

/**
 * @param {string} isoString
 * @returns {[number, number, number, number, number]}
 */
function convertToIcsDate(isoString) {
	let date = new Date(isoString);
	return [
		date.getUTCFullYear(),
		date.getUTCMonth() + 1, // getMonth() returns 0-11
		date.getUTCDate() - 1,
		date.getUTCHours(),
		date.getUTCMinutes(),
	];
}

/**
 * @param {Array<schema.Event>} events
 * @returns {Array<{ title: string, description: string, start: string, end: string }>}
 */
function mergeNonMatchEventGroup(events) {
	// Sort by start time
	events.sort((a, b) => a.start.localeCompare(b.start));

	/** @type {Array<Omit<schema.Event, "description"> & { description: Array<string> }>} */
	let merged = [];

	/** @type {Omit<schema.Event, "description"> & { description: Array<string> } | null} */
	let current = null;

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
 *
 * @param {Array<schema.Event>} events
 * @returns {Array<{ title: string, description: string, start: string, end: string }>}
 */
function combineEntries(events) {
	// Let's group non-matches together such that they end up as a single calendar
	// event if they overlap.
	let nonMatches = events.filter((event) => !event.match);
	let groups = Map.groupBy(
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

/**
 * @param {Array<schema.Event>} events
 * @returns {string}
 */
export function createIcsEntry(events) {
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
	// @ts-expect-error ics typings are wrong
	return result.value;
}

/**
 * @param {Pick<schema.Event, "match"| "discipline" | "medal">} event
 */
function formatTitle(event, prefix = "olympicks: ") {
	let title = event.discipline.name;
	let maybeMatch = formatMatchEntry(event.match);
	let maybeMedal = formatMedalEvent(event.medal);
	return `${prefix}${title}${maybeMatch}${maybeMedal}`;
}

/**
 * @param {schema.Event["match"]} match
 */
function formatMatchEntry(match) {
	if (match.kind === "known") {
		return ` - ${match.team1.name} vs ${match.team2.name}`;
	}
	return "";
}

/** @param {schema.Event["medal"]} medal */
function formatMedalEvent(medal) {
	return `${medal ? " (medal event)" : ""}`;
}
